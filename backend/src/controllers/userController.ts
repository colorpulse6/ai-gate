import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types";

const prisma = new PrismaClient();

class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          subscription: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const { name } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: { name },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          subscription: true,
        },
      });

      res.json({
        message: "Profile updated successfully",
        user,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      await prisma.user.delete({
        where: { id: req.user!.id },
      });

      res.clearCookie("token");
      res.json({ message: "Account deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: Number(limit),
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            subscription: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count(),
      ]);

      res.json({
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;
