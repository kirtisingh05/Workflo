import Board from "../models/board.js";

// GET endpoints:
// - /board/fetch/:id         -> Gets a board by id
// - /board/fetch?query=...     -> Gets boards based on a search query
async function fetchBoard(req, res) {
  const { id } = req.params;
  const { query } = req.query;

  try {
    if (id) {
      // Fetch board by ID
      const board = await Board.getById(id);
      if (!board) {
        return res
          .status(404)
          .json({ message: `Board with id ${id} not found` });
      }
      return res
        .status(200)
        .json({ data: board, message: `Board fetched successfully` });
    } else if (query) {
      // Fetch boards based on search query
      const boards = await Board.search(query);
      return res
        .status(200)
        .json({ data: boards, message: `Boards fetched successfully` });
    } else {
      return res
        .status(400)
        .json({ message: "Please provide either a board id or a search query" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching board(s)" });
  }
}

// POST endpoint:
// - /board/create -> Creates a new board
async function createBoard(req, res) {
  try {
    const boardData = req.body;
    const newBoard = await Board.create(boardData);
    res
      .status(201)
      .json({ data: newBoard, message: "Board created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while creating board" });
  }
}

// POST endpoint:
// - /board/update/:id -> Updates a board by id
async function updateBoard(req, res) {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedBoard = await Board.update(id, updateData);
    if (!updatedBoard) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: updatedBoard, message: `Board updated successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error while updating board" });
  }
}

// DELETE endpoint:
// - /board/delete/:id -> Deletes a board by id
async function deleteBoard(req, res) {
  const { id } = req.params;
  try {
    const deletedBoard = await Board.delete(id);
    if (!deletedBoard) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: deletedBoard, message: `Board deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting board" });
  }
}

export default {
  fetchBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
