import mongoose from "mongoose";
import { getAllTasks } from "./task";

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
  contributors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contributor",
    },
  ],
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const Board = mongoose.model("Board", boardSchema);

async function get(id) {
  try {
    const board = await Board.findById(id);
    return board;
  } catch (error) {
    throw new Error(`Error finding board with id ${id}: ${error.message}`);
  }
}

async function getAll(owner_id, filter = {}) {
  try {
    const query = { owner: owner_id, ...filter };
    const boards = await Board.find(query);
    return boards;
  } catch (error) {
    throw new Error(
      `Error fetching boards for user with id ${owner_id}: ${error.message}`,
    );
  }
}

async function create(boardData) {
  try {
    const { title, description, owner_id, contributor_ids, task_ids } =
      boardData;
    const board = new Board({
      title,
      description,
      owner: owner_id,
      contributors: contributor_ids,
      tasks: task_ids,
    });
    await board.save();
    return board._id;
  } catch (error) {
    throw new Error(`Error creating board: ${error.message}`);
  }
}

async function update(id, updateData) {
  try {
    const updatedBoard = await Board.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    await updatedBoard.save();
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

async function removeMany(board_ids) {
  try {
    if (!Array.isArray(board_ids) || board_ids.length === 0) {
      throw new Error("board_ids must be a non-empty array");
    }

    const deletedBoards = await Board.deleteMany({
      _id: { $in: board_ids },
    });

    return deletedBoards;
  } catch (error) {
    throw new Error("Error deleting tasks");
  }
}

export default {
  get,
  getAll,
  create,
  update,
  remove,
  removeMany,
};
