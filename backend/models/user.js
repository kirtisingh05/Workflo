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

async function create(userData) {
	try {
		const { username, email, password, profile_picture } = userData;
		const user = new User({
			username,
			email,
			password,
			profile_picture: profile_picture || null,
		});
		await user.save();
		return user._id;
	} catch (error) {
		throw new Error(`Error creating user: ${error.message}`);
	}
}

async function get(filter) {
	try {
		const user = await User.find(filter);
		return user;
	} catch (error) {
		throw new Error(`Error finding user with id ${id}: ${error.message}`);
	}
}

async function update(id, userData) {
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

async function remove(id) {
	try {
		const deletedUser = await User.findByIdAndDelete(id);
		return deletedUser;
	} catch (error) {
		throw new Error(`Error deleting user with id ${id}: ${error.message}`);
	}
}

export default {
	create,
	get,
	update,
	remove,
};
