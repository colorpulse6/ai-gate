import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  // Prisma errors
  if (error.code === "P2002") {
    return res.status(400).json({
      error: "Unique constraint violation",
      message: "A record with this information already exists",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
      message: "The requested resource was not found",
    });
  }

  // JWT errors
  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "Token expired",
      message: "Your session has expired, please login again",
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid token",
      message: "Invalid authentication token",
    });
  }

  // Validation errors
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation error",
      message: error.message,
    });
  }

  // Default error
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: error.name || "Internal Server Error",
    message: error.message || "Something went wrong",
  });
};
