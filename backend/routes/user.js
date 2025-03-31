import { Router } from "express";
import userController from "../controllers/user.js";

const router = Router();

router.post("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.removeUser);

export default router;
