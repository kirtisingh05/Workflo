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
    const aggregationPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.username": 1,
          "user.email": 1,
          "user.profile_picture": 1,
          role: 1,
          board: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $match: filter },
      { $sort: { createdAt: -1 } },
    ];
    const contributors = await Contributor.aggregate(aggregationPipeline);
    return contributors;
  } catch (error) {
    throw new Error(
      `Error fetching contributors for board ${board_id}: ${error.message}`,
    );
  }
}

async function create(contributorData) {
  try {
    const { user_id, board_id, role } = contributorData;

    const existingContributor = await Contributor.findOne({
      user: user_id,
      board: board_id,
    });

    if (existingContributor) {
      throw new Error("User is already a contributor to this board");
    }

    const contributor = new Contributor({
      user: user_id,
      board: board_id,
      role,
    });

    await contributor.save();
    return await Contributor.findById(contributor._id).populate(
      "user",
      "name email",
    );
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
    ).populate("user", "name email");

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

export default {
  getAll,
  create,
  update,
  remove,
  getRole,
};
