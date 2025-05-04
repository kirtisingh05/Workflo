import { Router } from "express";
import inviteController from "../controllers/invite.js";

const router = Router();

router.post("/decode", inviteController.decodeInviteHash);
router.post("/accept/:boardId/user/:userId", inviteController.acceptInvite);
router.post("/:boardId", inviteController.invite);

export default router;
