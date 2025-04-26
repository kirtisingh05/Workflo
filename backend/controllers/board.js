import Board from "../models/board.js";

// GET endpoints:
// - /board/fetch/:id         -> Gets a board by id
// - /board/fetch?query=...     -> Gets boards based on a search query
// - /board/fetch?trashed=true -> Gets trashed boards
async function fetchBoard(req, res) {
  const { id } = req.params;
  const { query, trashed } = req.query;
  const userId = req.user?._id; // Assuming user is attached by auth middleware

  try {
    if (id) {
      // Fetch single board by ID
      const board = await Board.get(id);
      if (!board) {
        return res
          .status(404)
          .json({ message: `Board with id ${id} not found` });
      }
      return res
        .status(200)
        .json({ data: board, message: "Board fetched successfully" });
    } else {
      // Fetch boards with optional search and trash filter
      if (query) {
        const boards = await Board.searchBoards(query, userId);
        return res
          .status(200)
          .json({ data: boards, message: "Boards fetched successfully" });
      }

      const filter = trashed === 'true' ? { isTrashed: true } : { isTrashed: false };
      const boards = await Board.getAll(userId, filter);
      return res
        .status(200)
        .json({ data: boards, message: "Boards fetched successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error while fetching board(s)" });
  }
}

// POST endpoint:
// - /board/create -> Creates a new board
async function createBoard(req, res) {
  try {
    const userId = req.user?._id; // Assuming user is attached by auth middleware
    const boardData = {
      ...req.body,
      owner_id: userId,
    };
    const board = await Board.create(boardData);
    res
      .status(201)
      .json({ data: board, message: "Board created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while creating board" });
  }
}

// POST endpoint:
// - /board/update/:id -> Updates a board by id
async function updateBoard(req, res) {
  const { id } = req.params;
  try {
    const updatedBoard = await Board.update(id, req.body);
    if (!updatedBoard) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: updatedBoard, message: "Board updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating board" });
  }
}

// DELETE endpoint:
// - /board/delete/:id -> Deletes a board by id
async function deleteBoard(req, res) {
  const { id } = req.params;
  try {
    // First check if board exists and is trashed
    const board = await Board.get(id);
    if (!board) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    
    if (!board.isTrashed) {
      return res
        .status(400)
        .json({ message: "Board must be moved to trash before permanent deletion" });
    }

    const deletedBoard = await Board.remove(id);
    res
      .status(200)
      .json({ data: deletedBoard, message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting board" });
  }
}

// POST endpoint:
// - /board/trash/:id -> Moves a board to trash
async function moveToTrash(req, res) {
  const { id } = req.params;
  try {
    const trashedBoard = await Board.moveToTrash(id);
    if (!trashedBoard) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: trashedBoard, message: "Board moved to trash successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while moving board to trash" });
  }
}

// POST endpoint:
// - /board/restore/:id -> Restores a board from trash
async function restoreFromTrash(req, res) {
  const { id } = req.params;
  try {
    const restoredBoard = await Board.restoreFromTrash(id);
    if (!restoredBoard) {
      return res
        .status(404)
        .json({ message: `Board with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: restoredBoard, message: "Board restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while restoring board" });
  }
}

export default {
  fetchBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  moveToTrash,
  restoreFromTrash,
};
