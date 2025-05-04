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

async function getAll(filter) {
  try {
    const contributors = await Contributor.find(filter)
      .populate("user", "username email profile_picture")
      .sort({ createdAt: -1 });
    return contributors;
  } catch (error) {
    throw new Error(`Error fetching contributors: ${error.message}`);
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

async function getRole(user_id, board_id) {
  try {
    const contributor = await Contributor.findOne({
      user: user_id,
      board: board_id,
    });
    return contributor?.role || null;
  } catch (error) {
    throw new Error(`Error getting user role: ${error.message}`);
  }
}

async function findById(board_id) {
  try {
    const contributors = await Contributor.find({ board: board_id })
      .populate("user", "username email profile_picture")
      .sort({ createdAt: -1 });
    return contributors;
  } catch (error) {
    throw new Error(
      `Error fetching contributors for board ${board_id}: ${error.message}`,
    );
  }
}

async function findOne(user_id, board_id) {
  try {
    const contributor = await Contributor.findOne({
      user: user_id,
      board: board_id,
    });
    return contributor?.role || null;
  } catch (error) {
    throw new Error(`Error getting user role: ${error.message}`);
  }
}

export default {
  getAll,
  create,
  update,
  remove,
  getRole,
  findById,
  findOne,
};
