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
    enum: ["ADMIN", "EDITOR", "VIEWER"],
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "DECLINED"],
    default: "PENDING",
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// Ensure unique user-board combination
contributorSchema.index({ user: 1, board: 1 }, { unique: true });

const Contributor = mongoose.model("Contributor", contributorSchema);

async function getAll(board_id, filter = {}) {
  try {
    const query = { board: board_id, ...filter };
    const contributors = await Contributor.find(query)
      .populate("user", "name email")
      .populate("invitedBy", "name email")
      .sort({ createdAt: -1 });
    return contributors;
  } catch (error) {
    throw new Error(
      `Error fetching contributors for board ${board_id}: ${error.message}`,
    );
  }
}

async function search(searchQuery) {
  try {
    const contributors = await Contributor.find({
      $or: [
        { "user.email": { $regex: searchQuery, $options: "i" } },
        { "user.name": { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("user", "name email")
      .populate("board", "title")
      .populate("invitedBy", "name email");
    return contributors;
  } catch (error) {
    throw new Error(`Error searching contributors: ${error.message}`);
  }
}

async function create(contributorData) {
  try {
    const { user_id, board_id, role, invited_by } = contributorData;
    
    // Check for existing invitation
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
      invitedBy: invited_by,
    });

    await contributor.save();
    return await Contributor.findById(contributor._id)
      .populate("user", "name email")
      .populate("invitedBy", "name email");
  } catch (error) {
    throw new Error(`Error creating contributor: ${error.message}`);
  }
}

async function update(id, contributorData) {
  try {
    const updatedContributor = await Contributor.findByIdAndUpdate(
      id,
      contributorData,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "name email")
      .populate("invitedBy", "name email");

    if (!updatedContributor) {
      throw new Error(`Contributor with id ${id} not found`);
    }

    return updatedContributor;
  } catch (error) {
    throw new Error(`Error updating contributor with id ${id}: ${error.message}`);
  }
}

async function remove(id) {
  try {
    const deletedContributor = await Contributor.findByIdAndDelete(id);
    return deletedContributor;
  } catch (error) {
    throw new Error(`Error deleting contributor with id ${id}: ${error.message}`);
  }
}

async function getUserRole(user_id, board_id) {
  try {
    const contributor = await Contributor.findOne({
      user: user_id,
      board: board_id,
      status: "ACCEPTED",
    });
    return contributor?.role || null;
  } catch (error) {
    throw new Error(`Error getting user role: ${error.message}`);
  }
}

async function acceptInvitation(id) {
  try {
    const updatedContributor = await Contributor.findByIdAndUpdate(
      id,
      { status: "ACCEPTED" },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "name email")
      .populate("invitedBy", "name email");

    if (!updatedContributor) {
      throw new Error(`Contributor with id ${id} not found`);
    }

    return updatedContributor;
  } catch (error) {
    throw new Error(`Error accepting invitation: ${error.message}`);
  }
}

async function declineInvitation(id) {
  try {
    const updatedContributor = await Contributor.findByIdAndUpdate(
      id,
      { status: "DECLINED" },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("user", "name email")
      .populate("invitedBy", "name email");

    if (!updatedContributor) {
      throw new Error(`Contributor with id ${id} not found`);
    }

    return updatedContributor;
  } catch (error) {
    throw new Error(`Error declining invitation: ${error.message}`);
  }
}

export default {
  getAll,
  search,
  create,
  update,
  remove,
  getUserRole,
  acceptInvitation,
  declineInvitation,
};
