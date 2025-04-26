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
    const contributors = await Contributor.getAll(board_id);
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
    const { user_id, board_id, role } = req.body;
    const invited_by = req.user?._id; // From auth middleware

    if (!user_id || !board_id || !role || !invited_by) {
      return res
        .status(400)
        .json({ message: "Missing required fields" });
    }

    const contributor = await Contributor.create({
      user_id,
      board_id,
      role,
      invited_by,
    });

    // TODO: Send invitation email to user

    res
      .status(201)
      .json({ data: contributor, message: "Contributor invitation sent successfully" });
  } catch (error) {
    if (error.message.includes("already a contributor")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Error while creating contributor" });
  }
}

// 2. /contributor/update/:id : updates a contributor by id
async function updateContributor(req, res) {
  const { id } = req.params;
  try {
    const updateData = req.body;
    const updatedContributor = await Contributor.update(id, updateData);
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
    const deletedContributor = await Contributor.remove(id);
    if (!deletedContributor) {
      return res
        .status(404)
        .json({ message: `Contributor with id ${id} not found` });
    }
    res
      .status(200)
      .json({ data: deletedContributor, message: "Contributor removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while removing contributor" });
  }
}

// POST endpoints:
//
// 1. /contributor/accept/:id : accepts an invitation
async function acceptInvitation(req, res) {
  const { id } = req.params;
  try {
    const updatedContributor = await Contributor.acceptInvitation(id);
    res
      .status(200)
      .json({ data: updatedContributor, message: "Invitation accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while accepting invitation" });
  }
}

// 2. /contributor/decline/:id : declines an invitation
async function declineInvitation(req, res) {
  const { id } = req.params;
  try {
    const updatedContributor = await Contributor.declineInvitation(id);
    res
      .status(200)
      .json({ data: updatedContributor, message: "Invitation declined successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while declining invitation" });
  }
}

export default {
  fetchContributors,
  fetchContributorsByBoard,
  createContributor,
  updateContributor,
  deleteContributor,
  acceptInvitation,
  declineInvitation,
};
