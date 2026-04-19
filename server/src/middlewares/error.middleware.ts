import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = async (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode;
  const message = err.message;
  res
    .status(statusCode)
    .json({ success: false, message: message || "Internal Server Error" });
};
