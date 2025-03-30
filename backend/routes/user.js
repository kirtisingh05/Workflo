import { Router } from "express";
import userController from "../controllers/user.js";

const router = Router();

router.post("/update/:id", userController.updateUser);

export default router;
