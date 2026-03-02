import { Request, Response, NextFunction } from "express";
import {  ZodError } from "zod";
import { ApiError } from "../utils/apiError";
import jwt from "jsonwebtoken";
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);


   const statusCode = err.statusCode || 500;
  // ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod Error
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // Mongoose Validation
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((e: any) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate Key Error",
    });
  }

  // Token error
  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Token Expired",
    });
  }

    // Token error
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
  //   General
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
