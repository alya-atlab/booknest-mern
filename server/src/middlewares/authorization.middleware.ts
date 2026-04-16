import { NextFunction, Request, Response } from "express";

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(user.role))
      return res.status(403).json({ message: "Forbidden" });
    next();
  };
};
