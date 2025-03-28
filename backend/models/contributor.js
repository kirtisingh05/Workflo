import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Board",
		required: true,
	},
	role: {
		type: String,
		enum: ["ADMIN", "VIEWER", "EDITOR"],
		required: true,
	},
});

const Contributor = mongoose.model("Contributor", contributorSchema);

async function getAllContributors(board_id, filter = {}) {
	try {
		const query = { board: board_id, ...filter };
		const contributors = await Contributor.find(query);
		return contributors;
	} catch (error) {
		throw new Error(
			`Error fetching contributors for board ${board_id}: ${error.message}`,
		);
	}
}

async function createContributor(contributorData) {
	try {
		const { user_id, board_id, role } = contributorData;
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

async function updateContributor(contributor_id, contributorData) {
	try {
		const updatedContributor = await Contributor.findByIdAndUpdate(
			contributor_id,
			contributorData,
			{
				new: true,
				runValidators: true,
			},
		);
		return updatedContributor;
	} catch (error) {
		throw new Error(
			`Error updating contributor with id ${contributor_id}: ${error.message}`,
		);
	}
}

async function deleteContributor(id) {
	try {
		const deletedContributor = await Contributor.findByIdAndDelete(id);
		return deletedContributor;
	} catch (error) {
		throw new Error(
			`Error deleting contributor with id ${id}: ${error.message}`,
		);
	}
}

export default {
	getAllContributors,
	createContributor,
	updateContributor,
	deleteContributor,
};
