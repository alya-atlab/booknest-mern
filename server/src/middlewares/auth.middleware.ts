import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const protect = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return next(new ApiError("authorization header was not provided", 401));
  }
  const [prefix, token] = authorizationHeader.split(" ");

  if (prefix !== "Bearer" || !token) {
    return next(new ApiError("Unauthorized", 401));
  }
  if (!process.env.JWT_SECRET) {
    return next(new ApiError("JWT_SECRET is not defined", 403));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    interface AuthPayload {
      userId: string;
      role: "admin" | "author" | "user";
    }
    const userPayload = decoded as AuthPayload;

    req.user = { _id: userPayload.userId, role: userPayload.role };
    next();
  } catch {
    return next(new ApiError("Invalid Token", 403));
  }
};
export default protect;
