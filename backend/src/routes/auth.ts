import { Router } from "express";
import AuthController from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// Protected routes
router.get("/me", authenticateToken, AuthController.me);
router.post("/refresh", AuthController.refreshToken);

export default router;
