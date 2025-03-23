import mongoose from "mongoose";

// Define the Task sub-schema
const taskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	status: {
		type: String,
		enum: ["NOT STARTED", "IN PROGRESS", "COMPLETED"],
		required: true,
	},
	deadline: {
		type: Date,
	},
	created_by: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	assigned_to: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, { _id: false }); // Disable _id for tasks if not needed

// Define the Board schema
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
	contributors: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Contributor", // or "User", depending on your implementation
	}],
	tasks: [taskSchema],
});

// Create the Board model
const Board = mongoose.model("Board", boardSchema);

// Method to get a board by its id
async function getBoardById(id) {
	try {
		const board = await Board.findById(id);
		return board;
	} catch (error) {
		throw new Error(`Error finding board with id ${id}: ${error.message}`);
	}
}

// Method to get all boards associated with a user (as owner or contributor)
async function getAllBoards(user_id) {
	try {
		const boards = await Board.find({
			$or: [
				{ owner: user_id },
				{ contributors: user_id }
			],
		});
		return boards;
	} catch (error) {
		throw new Error(`Error fetching boards for user with id ${user_id}: ${error.message}`);
	}
}

// Method to create a new board
async function createBoard(title, description, owner_id, contributor_ids = []) {
	try {
		const board = new Board({
			title,
			description,
			owner: owner_id,
			contributors: contributor_ids,
			tasks: [],
		});
		await board.save();
		return board._id;
	} catch (error) {
		throw new Error(`Error creating board: ${error.message}`);
	}
}

// Method to update a board (title and/or description)
async function updateBoard(id, updateData) {
	try {
		const updatedBoard = await Board.findByIdAndUpdate(id, updateData, {
			new: true,
			runValidators: true,
		});
		return updatedBoard;
	} catch (error) {
		throw new Error(`Error updating board with id ${id}: ${error.message}`);
	}
}

// Method to delete a board by id
async function deleteBoard(id) {
	try {
		const deletedBoard = await Board.findByIdAndDelete(id);
		if (deletedBoard) {
			return { message: "Board deleted successfully." };
		} else {
			return { message: "Board not found." };
		}
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
