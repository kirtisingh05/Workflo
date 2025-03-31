import Contributor from "../models/contributor.js";

// GET endpoints:
//
// 1. /contributor/fetch?query=<query_params> : gets contributors based on search query
async function fetchContributors(req, res) {
  const { query } = req.query;
  try {
    if (!query) {
      return res
        .status(400)
        .json({ message: "Query parameter is missing" });
    }
    const contributors = await Contributor.search(query);
    res
      .status(200)
      .json({ data: contributors, message: "Contributors fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching contributors" });
  }
}

// 2. /contributor/fetch/:board_id : gets all contributors of a board by board_id
async function fetchContributorsByBoard(req, res) {
  const { board_id } = req.params;
  try {
    const contributors = await Contributor.getByBoardId(board_id);
    if (!contributors || contributors.length === 0) {
      return res
        .status(404)
        .json({ message: `No contributors found for board id ${board_id}` });
    }
    res
      .status(200)
      .json({ data: contributors, message: "Contributors fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching contributors for board" });
  }
}

// POST endpoints:
//
// 1. /contributor/update : creates a contributor
async function createContributor(req, res) {
  try {
    const contributorData = req.body;
    const newContributor = await Contributor.create(contributorData);
    res
      .status(201)
      .json({ data: newContributor, message: "Contributor created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while creating contributor" });
  }
}

// 2. /contributor/update/:id : updates a contributor by id
async function updateContributor(req, res) {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedContributor = await Contributor.update(id, updateData);
    if (!updatedContributor) {
      return res
        .status(404)
        .json({ message: `Contributor with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: updatedContributor, message: "Contributor updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while updating contributor" });
  }
}

// DELETE endpoint:
//
// /contributor/delete/:id : deletes a contributor by id
async function deleteContributor(req, res) {
  const { id } = req.params;
  try {
    const deletedContributor = await Contributor.delete(id);
    if (!deletedContributor) {
      return res
        .status(404)
        .json({ message: `Contributor with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: deletedContributor, message: "Contributor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while deleting contributor" });
  }
}

export default {
  fetchContributors,
  fetchContributorsByBoard,
  createContributor,
  updateContributor,
  deleteContributor,
};
