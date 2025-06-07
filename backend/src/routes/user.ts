import { Router } from "express";
import UserController from "../controllers/userController";
import { authenticateToken, requireRole } from "../middleware/auth";

const router = Router();

// Protected routes
router.get("/profile", authenticateToken, UserController.getProfile);
router.put("/profile", authenticateToken, UserController.updateProfile);
router.delete("/account", authenticateToken, UserController.deleteAccount);

// Admin routes
router.get(
  "/",
  authenticateToken,
  requireRole(["ADMIN"]),
  UserController.getAllUsers
);

export default router;
