import Board from "../models/board.js";
import Contributor from "../models/contributor.js";

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
    const contributor = await Contributor.getOne(id, userId);
    if (!contributor || contributor?.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete the board" });
    }

    const deletedBoard = await Board.remove(id);
    if (!deletedBoard) {
      return res.status(404).json({ message: `Board with id ${id} not found` });
    }

    res
      .status(200)
      .json({ data: deletedBoard, message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting board" });
  }
}

export default {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
};
