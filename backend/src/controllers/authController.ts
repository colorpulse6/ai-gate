import { Request, Response } from "express";
import AuthService from "../services/authService";
import { LoginRequest, RegisterRequest } from "../types";

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name }: RegisterRequest = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await AuthService.register({ email, password, name });

      // Set HTTP-only cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: "User registered successfully",
        user: result.user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await AuthService.login({ email, password });

      // Set HTTP-only cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        message: "Login successful",
        user: result.user,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  }

  static async me(req: Request, res: Response) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decoded = AuthService.verifyToken(token);
      const result = await AuthService.refreshToken(decoded.id);

      res.json({
        user: result.user,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decoded = AuthService.verifyToken(token);
      const result = await AuthService.refreshToken(decoded.id);

      // Set new HTTP-only cookie
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        message: "Token refreshed successfully",
        user: result.user,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default AuthController;
