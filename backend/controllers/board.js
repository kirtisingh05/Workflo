import Board from "../models/board.js";
import Contributor from "../models/contributor.js";
import Task from "../models/task.js";

function filterBuilder(query, userId, contributorIds) {
  const accessCondition = {
    $or: [{ owner: userId }, { contributors: { $in: contributorIds } }],
  };

  const filter = [accessCondition];

  if (query.trashed === "true") {
    filter.push({ trashed: true });
  } else {
    filter.push({ trashed: false });
  }

  if (query.title) {
    filter.push({
      title: { $regex: query.title, $options: "i" },
    });
  }

  return { $and: filter };
}

async function fetchBoards(req, res) {
  const { id } = req.params;
  const query = req.query;
  const userId = req.user_id;

  try {
    if (id) {
      const contributor = await Contributor.getOne(id, userId);
      if (!contributor) {
        return res
          .status(403)
          .json({ message: "Unauthorized access to board" });
      }

      const board = await Board.get(id);
      if (!board) {
        return res.status(404).json({ message: "Board not found!" });
      }

      return res.status(200).json({ data: board });
    } else {
      const contributors = await Contributor.getAllByUser(userId);
      const contributorIds = contributors.map((contrib) =>
        contrib._id.toString(),
      );
      const filter = filterBuilder(query, userId, contributorIds);
      const boards = await Board.getAll(filter);
      return res.status(200).json({ data: boards });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while fetching board(s)", error: error.message });
  }
}

async function createBoard(req, res) {
  const userId = req.user_id;
  const { title, description, tasks, createdAt } = req.body;

  try {
    const boardData = {
      title,
      description,
      owner: userId,
      tasks,
      createdAt,
    };

    const boardId = await Board.create(boardData);
    const owner = await Contributor.create({
      user: userId,
      board: boardId,
      role: "ADMIN",
    });
    await Board.update(boardId, { contributors: [owner._id] });

    res
      .status(201)
      .json({ data: boardId, message: "Board created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while creating board", error: error.message });
  }
}

async function updateBoard(req, res) {
  const { id } = req.params;
  const userId = req.user_id;

  try {
    const contributor = await Contributor.getOne(id, userId);
    if (
      !contributor ||
      (contributor?.role !== "ADMIN" && contributor?.role !== "EDITOR")
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update the board" });
    }

    const updatedBoard = await Board.update(id, req.body);
    if (!updatedBoard) {
      return res.status(404).json({ message: `Board with id ${id} not found` });
    }

    res
      .status(200)
      .json({ data: updatedBoard, message: "Board updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while updating board", error: error.message });
  }
}

async function deleteBoard(req, res) {
  const { id } = req.params;
  const userId = req.user_id;

  try {
    // Check if user is board admin
    const contributor = await Contributor.getOne(id, userId);
    if (!contributor || contributor?.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Only board administrators can permanently delete boards" });
    }

    // Get board to check if it exists and is in trash
    const board = await Board.get(id);
    if (!board) {
      return res.status(404).json({ message: `Board with id ${id} not found` });
    }

    if (!board.trashed) {
      return res.status(400).json({ 
        message: "Board must be moved to trash before permanent deletion" 
      });
    }

    // Delete all associated tasks first
    await Task.deleteMany({ board: id });

    // Delete all contributor records
    await Contributor.deleteMany({ board: id });

    // Finally delete the board itself
    const deletedBoard = await Board.remove(id);
    
    res.status(200).json({ 
      data: deletedBoard, 
      message: "Board and all associated data permanently deleted" 
    });
  } catch (error) {
    console.error("Error deleting board:", error);
    res.status(500).json({ 
      message: "Error while deleting board",
      error: error.message 
    });
  }
}

export default {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
