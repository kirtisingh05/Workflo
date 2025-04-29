import Board from "../models/board.js";
import Contributor from "../models/contributor.js";

function filterBuilder(query, userId) {
  const filter = {
    $or: [{ owner: userId }, { contributors: userId }],
  };

  if (query.trashed !== undefined) {
    filter.trashed = query.trashed === "true";
  } else {
    filter.trashed = false;
  }

  if (query.title) {
    filter.title = { $regex: query.title, $options: "i" };
  }

  return filter;
}

async function isAuthorized(boardId, userId) {
  const board = await Board.get(boardId);
  const isOwner = board?.owner.toString() === userId;
  const isContributor = board?.contributors.some(
    (contributorId) => contributorId.toString() === userId,
  );
  const role = await Contributor.getRole(userId, boardId);
  return (role === "ADMIN" || role === "EDITOR") && (isOwner || isContributor);
}

async function fetchBoards(req, res) {
  const { id } = req.params;
  const query = req.query;
  const userId = req.user_id;
  console.log(userId);

  try {
    if (id) {
      if (!(await isAuthorized(id, userId))) {
        return res
          .status(403)
          .json({ message: "Unauthorized access to board" });
      }

      const board = await Board.get(id);
      if (!board) {
        return res.status(404).json({ message: "Board not found!" });
      }

      if (board.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized access to board" });
      }

      return res.status(200).json({ data: board });
    } else {
      const filter = filterBuilder(query, userId);
      const boards = await Board.getAll(userId, filter);
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

  try {
    let boardData = {
      ...req.body,
      owner: userId,
    };

    const boardId = await Board.create(boardData);
    const owner = await Contributor.create({
      user_id: userId,
      board_id: boardId,
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
    if (!(await isAuthorized(id, userId))) {
      return res.status(403).json({ message: "Unauthorized access to board" });
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
    if (!(await isAuthorized(id, userId))) {
      return res.status(403).json({ message: "Unauthorized access to board" });
    }

    const deletedBoard = await Board.remove(id);
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
