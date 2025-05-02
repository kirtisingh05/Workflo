import mongoose from "mongoose";
import Contributor from "../models/contributor.js";
import User from "../models/user.js";

function filterBuilder(query, board_id) {
  const filter = {
    board: mongoose.Types.ObjectId.createFromHexString(board_id),
  };

  if (query.role) {
    filter.role = query.role;
  }

  if (query.search) {
    filter.$or = [
      { "user.username": { $regex: query.search, $options: "i" } },
      { "user.email": { $regex: query.search, $options: "i" } },
    ];
  }

  return filter;
}

async function fetchContributors(req, res) {
  const { board_id } = req.params;
  const query = req.query;

  try {
    const filter = filterBuilder(query, board_id);
    const contributors = await Contributor.getAll(filter);

    res.status(200).json({
      data: contributors,
      message: "Contributors fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while fetching contributors for board" });
  }
}

async function createContributor(req, res) {
  try {
    const { email, board_id, role } = req.body;

    if (!email || !board_id || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const user = await User.get({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const existingContributor = await Contributor.findOne({
      user: user._id,
      board: board_id
    });

    if (existingContributor) {
      return res.status(400).json({ message: "User is already a contributor to this board" });
    }

    const contributor = await Contributor.create({
      user: user._id,
      board: board_id,
      role
    });

    const populatedContributor = await Contributor.findById(contributor._id)
      .populate("user", "username email profile_picture");

    res.status(201).json({
      data: populatedContributor,
      message: "Contributor added successfully",
    });
  } catch (error) {
    console.error("Error creating contributor:", error);
    res.status(500).json({
      message: "Error while creating contributor",
      error: error.message,
    });
  }
}

async function updateContributor(req, res) {
  const { id } = req.params;
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updatedContributor = await Contributor.update(id, { role });
    const populatedContributor = await Contributor.findById(updatedContributor._id)
      .populate("user", "username email profile_picture");

    res.status(200).json({
      data: populatedContributor,
      message: "Contributor updated successfully",
    });
  } catch (error) {
    console.error("Error updating contributor:", error);
    res.status(500).json({ 
      message: "Error while updating contributor",
      error: error.message
    });
  }
}

async function deleteContributor(req, res) {
  const { id } = req.params;
  try {
    const deletedContributor = await Contributor.remove(id);
    if (!deletedContributor) {
      return res
        .status(404)
        .json({ message: `Contributor with id ${id} not found` });
    }
    res.status(200).json({
      data: deletedContributor,
      message: "Contributor removed successfully",
    });
  } catch (error) {
    console.error("Error deleting contributor:", error);
    res.status(500).json({ 
      message: "Error while removing contributor",
      error: error.message
    });
  }
}

export default {
  fetchContributors,
  createContributor,
  updateContributor,
  deleteContributor,
};
