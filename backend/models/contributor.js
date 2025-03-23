import mongoose from "mongoose";

// Define the Contributor schema
const contributorSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User", // assuming there is a User model
		required: true,
	},
	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Board", // assuming there is a Board model
		required: true,
	},
	role: {
		type: String,
		enum: ["ADMIN", "VIEWER", "EDITOR"],
		required: true,
	},
});

// Create the Contributor model
const Contributor = mongoose.model("Contributor", contributorSchema);

// Method to get all contributors for a specific board
async function getAllContributors(board_id) {
	try {
		const contributors = await Contributor.find({ board: board_id });
		return contributors;
	} catch (error) {
		throw new Error(`Error fetching contributors for board ${board_id}: ${error.message}`);
	}
}

// Method to create a new contributor
async function createContributor(user_id, board_id, role) {
	try {
		const contributor = new Contributor({
			user: user_id,
			board: board_id,
			role,
		});
		await contributor.save();
		return contributor._id;
	} catch (error) {
		throw new Error(`Error creating contributor: ${error.message}`);
	}
}

// Method to update a contributor by id
async function updateContributor(contributor_id, updateData) {
	try {
		const updatedContributor = await Contributor.findByIdAndUpdate(contributor_id, updateData, {
			new: true,
			runValidators: true,
		});
		return updatedContributor;
	} catch (error) {
		throw new Error(`Error updating contributor with id ${contributor_id}: ${error.message}`);
	}
}

// Method to delete a contributor by id
async function deleteContributor(id) {
	try {
		const deletedContributor = await Contributor.findByIdAndDelete(id);
		if (deletedContributor) {
			return { message: "Contributor deleted successfully." };
		} else {
			return { message: "Contributor not found." };
		}
	} catch (error) {
		throw new Error(`Error deleting contributor with id ${id}: ${error.message}`);
	}
}

export default {
	getAllContributors,
	createContributor,
	updateContributor,
	deleteContributor,
};
