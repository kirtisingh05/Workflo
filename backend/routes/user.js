import { Router } from "express";
import userController from "../controllers/user.js";

const router = Router();

router.get("/me", userController.me);
router.post("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.removeUser);

export default router;
