import { Router } from "express";
import contributorController from "../controllers/contributor.js";

const router = Router();

router.get("/fetch/:board_id", contributorController.fetchContributors);

router.post("/create", contributorController.createContributor);
router.post("/update/:id", contributorController.updateContributor);

router.delete("/delete/:id", contributorController.deleteContributor);

export default router;
