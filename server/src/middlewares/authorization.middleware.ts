import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return next(new ApiError("Unauthorized", 401));
    }
    if (!roles.includes(user.role)) {
      return next(new ApiError("Forbidden", 403));
    }

    next();
  };
};
