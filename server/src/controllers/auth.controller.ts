import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: "User Created Successfully", data: user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed!" });
  }
};
