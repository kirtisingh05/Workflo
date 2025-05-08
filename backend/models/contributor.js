import mongoose from "mongoose";

const contributorSchema = new mongoose.Schema(
  {
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
      enum: ["ADMIN", "EDITOR", "VIEWER"],
      required: true,
    },
  },
  { timestamps: true },
);

const Contributor = mongoose.model("Contributor", contributorSchema);

async function getAllByUser(user_id, filter = {}) {
  try {
    const query = { user: user_id, ...filter };
    const contributors = await Contributor.find(query);
    return contributors;
  } catch (error) {
    throw new Error(`Error fetching contributors: ${error.message}`);
  }
}

async function getAllByBoard(board_id, filter = {}) {
  try {
    const query = { board: board_id, ...filter };
    const contributors = await Contributor.find(query)
      .populate("user", "username email profile_picture")
      .sort({ createdAt: -1 });
    return contributors;
  } catch (error) {
    throw new Error(
      `Error fetching contributors for board: ${board_id}: ${error.message}`,
    );
  }
}

async function getOne(board_id, user_id) {
  try {
    const contributor = await Contributor.findOne({
      board: board_id,
      user: user_id,
    });

    return contributor;
  } catch (error) {
    throw new Error(`Error fetching contributor: ${error.message}`);
  }
}

async function create(contributorData) {
  try {
    const { user, board, role } = contributorData;

    const contributor = new Contributor({
      user,
      board,
      role,
    });

    await contributor.save();
    return contributor;
  } catch (error) {
    throw new Error(`Error creating contributor: ${error.message}`);
  }
}

async function update(id, contributorData) {
  try {
    const { role } = contributorData;

    const updatedContributor = await Contributor.findByIdAndUpdate(
      id,
      { role },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContributor) {
      throw new Error(`Contributor with id ${id} not found`);
    }

    return updatedContributor;
  } catch (error) {
    throw new Error(
      `Error updating contributor with id ${id}: ${error.message}`,
    );
  }
}

async function remove(id) {
  try {
    const deletedContributor = await Contributor.findByIdAndDelete(id);
    if (!deletedContributor) {
      throw new Error(`Contributor with id ${id} not found`);
    }
    return deletedContributor;
  } catch (error) {
    throw new Error(
      `Error deleting contributor with id ${id}: ${error.message}`,
    );
  }
}

async function deleteMany(filter) {
  try {
    const result = await Contributor.deleteMany(filter);
    return result;
  } catch (error) {
    throw new Error(`Error deleting multiple contributors: ${error.message}`);
  }
}

export default {
  getAllByBoard,
  getAllByUser,
  getOne,
  create,
  update,
  remove,
  deleteMany,
};
