import mongoose from "mongoose";
import Contributor from "../models/contributor.js";

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

    if (!contributors || contributors.length === 0) {
      return res.status(404).json({ message: "No contributors found" });
    }

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
    const { user_id, board_id, role } = req.body;

    if (!user_id || !board_id || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const contributor = await Contributor.create({
      user_id,
      board_id,
      role,
    });

    res.status(201).json({
      data: contributor,
      message: "Contributor created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while creating contributor",
      error: error.message,
    });
  }
}

async function updateContributor(req, res) {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedContributor = await Contributor.update(id, updateData);
    res.status(200).json({
      data: updatedContributor,
      message: "Contributor updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error while updating contributor" });
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
    res.status(500).json({ message: "Error while removing contributor" });
  }
}

export default {
  fetchContributors,
  createContributor,
  updateContributor,
  deleteContributor,
};
