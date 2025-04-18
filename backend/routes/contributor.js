import { Router } from "express";
import contributorController from "../controllers/contributor.js";

const router = Router();

// GET endpoints:
// /contributor/fetch?query=<query_params> -> Searches contributors based on query params
// /contributor/fetch/:board_id -> Gets all contributors of a board by board_id
router.get("/fetch", contributorController.fetchContributors);
router.get("/fetch/:board_id", contributorController.fetchContributorsByBoard);

// POST endpoints:
// /contributor/update -> Creates a contributor
// /contributor/update/:id -> Updates a contributor by id
router.post("/update", contributorController.createContributor);
router.post("/update/:id", contributorController.updateContributor);

// DELETE endpoint:
// /contributor/delete/:id -> Deletes a contributor by id
router.delete("/delete/:id", contributorController.deleteContributor);

export default router;
