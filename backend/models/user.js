import mongoose from "mongoose";

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

async function getUserById(id) {
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
		return updatedUser;
	} catch (error) {
		throw new Error(`Error updating user with id ${id}: ${error.message}`);
	}
}

async function removeUser(id) {
	try {
		const deletedUser = await User.findByIdAndDelete(id);
		return deletedUser.acknowledged;
	} catch (error) {
		throw new Error(`Error deleting user with id ${id}: ${error.message}`);
	}
}

export default {
	getUserById,
	updateUser,
	removeUser,
};
