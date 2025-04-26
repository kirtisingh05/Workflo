import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isShared: {
    type: Boolean,
    default: false,
  },
  isTrashed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Board = mongoose.model("Board", boardSchema);

async function get(id) {
  try {
    const board = await Board.findById(id)
      .populate("owner", "name email");
    return board;
  } catch (error) {
    throw new Error(`Error finding board with id ${id}: ${error.message}`);
  }
}

async function getAll(owner_id, filter = {}) {
  try {
    const query = { owner: owner_id, ...filter };
    const boards = await Board.find(query)
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });
    return boards;
  } catch (error) {
    throw new Error(
      `Error fetching boards for user with id ${owner_id}: ${error.message}`,
    );
  }
}

async function searchBoards(searchQuery, owner_id) {
  try {
    const query = {
      owner: owner_id,
      isTrashed: false,
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    };
    
    const boards = await Board.find(query)
      .populate("owner", "name email")
      .sort({ updatedAt: -1 });
    return boards;
  } catch (error) {
    throw new Error(`Error searching boards: ${error.message}`);
  }
}

async function create(boardData) {
  try {
    const board = new Board({
      title: boardData.title,
      description: boardData.description,
      owner: boardData.owner_id,
    });
    await board.save();
    return await get(board._id);
  } catch (error) {
    throw new Error(`Error creating board: ${error.message}`);
  }
}

async function update(id, updateData) {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");
    
    if (!updatedBoard) {
      throw new Error(`Board with id ${id} not found`);
    }
    return updatedBoard;
  } catch (error) {
    throw new Error(`Error updating board with id ${id}: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const deletedBoard = await Board.findByIdAndDelete(id);
    return deletedBoard;
  } catch (error) {
    throw new Error(`Error deleting board with id ${id}: ${error.message}`);
  }
}

async function moveToTrash(id) {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { isTrashed: true },
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");
    
    if (!updatedBoard) {
      throw new Error(`Board with id ${id} not found`);
    }
    return updatedBoard;
  } catch (error) {
    throw new Error(`Error moving board to trash: ${error.message}`);
  }
}

async function restoreFromTrash(id) {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { isTrashed: false },
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");
    
    if (!updatedBoard) {
      throw new Error(`Board with id ${id} not found`);
    }
    return updatedBoard;
  } catch (error) {
    throw new Error(`Error restoring board from trash: ${error.message}`);
  }
}

export default {
  get,
  getAll,
  create,
  update,
  remove,
  searchBoards,
  moveToTrash,
  restoreFromTrash,
};
