import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const protect = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(403).json({message:"authorization header was not provided"});
  }
  const [prefix, token] = authorizationHeader.split(" ");

  if (prefix !== "Bearer" || !token) {
    return res.status(401).json({ message: "Not authorized" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(403).json({message: "JWT_SECRET is not defined"});
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
    return res.status(401).json({message: "Invalid Token!"});
  }
};
export default protect;
