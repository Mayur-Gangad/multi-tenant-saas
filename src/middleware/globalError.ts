import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(err);

  // ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Zod Error
  if ((err as ZodError).issues) { //TypeScript sometimes fails to narrow instanceof for generic error types.
  const zodError = err as ZodError;

  return res.status(400).json({
    success: false,
    message: "Validation Error",
    errors: zodError.issues.map((issue) => ({
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

//   General
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
