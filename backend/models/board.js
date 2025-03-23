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

async function getBoardById(id) {
	try {
		const board = await Board.findById(id);
		return board;
	} catch (error) {
		throw new Error(`Error finding board with id ${id}: ${error.message}`);
	}
}

async function getAllBoards(owner_id) {
	try {
		const boards = await Board.find({ owner: owner_id });
		return boards;
	} catch (error) {
		throw new Error(
			`Error fetching boards for user with id ${owner_id}: ${error.message}`,
		);
	}
}

async function createBoard(boardData) {
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

async function updateBoard(id, updateData) {
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

async function deleteBoard(id) {
	try {
		const tasks = await getAllTasks(id);
		const taskIds = tasks.map((task) => task._id);
		await deleteTasks(taskIds);

		const deletedBoard = await Board.findByIdAndDelete(id);

		return deletedBoard;
	} catch (error) {
		throw new Error(`Error deleting board with id ${id}: ${error.message}`);
	}
}

export default {
	getBoardById,
	getAllBoards,
	createBoard,
	updateBoard,
	deleteBoard,
};
