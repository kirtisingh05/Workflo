import mongoose from "mongoose";
import { getAllBoards, deleteBoards } from "./board";

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	profile_picture: {
		type: String,
	},
});

const User = mongoose.model("User", userSchema);

async function getUser(id) {
	try {
		const user = await User.findById(id);
		return user;
	} catch (error) {
		throw new Error(`Error finding user with id ${id}: ${error.message}`);
	}
}

async function updateUser(id, userData) {
	try {
		const updatedUser = await User.findByIdAndUpdate(id, userData, {
			new: true,
			runValidators: true,
		});
		updatedUser.save();
		return updatedUser;
	} catch (error) {
		throw new Error(`Error updating user with id ${id}: ${error.message}`);
	}
}

async function removeUser(id) {
	try {
		const boards = await getAllBoards(id);
		const boardIds = boards.map((board) => board._id);

		await deleteBoards(boardIds);

		const deletedUser = await User.findByIdAndDelete(id);
		return deletedUser;
	} catch (error) {
		throw new Error(`Error deleting user with id ${id}: ${error.message}`);
	}
}

export default {
	getUser,
	updateUser,
	removeUser,
};
