import express from "express";

import authController from "../controllers/auth.js";

const router = express.Router();

router.get("/me", authController.me);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signout", authController.signout);

export default router;
