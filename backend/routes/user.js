import { Router } from "express";
import userController from "../controllers/user.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/me", auth, userController.me);
router.get("/:id", auth, userController.getUser);
router.post("/update/:id", auth, userController.updateUser);
router.delete("/delete/:id", auth, userController.removeUser);

export default router;
