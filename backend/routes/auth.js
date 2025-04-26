import { Router } from "express";
import authController from "../controllers/Auth.js";
import { protect } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);

// Protected routes
router.get("/me", protect, authController.getUser);

export default router;