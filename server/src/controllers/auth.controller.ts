import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {token,user} = await authService.registerUser(req.body);
    res.status(201).json({ message: "User Created Successfully",token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed!" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { token, user } = await authService.loginUser(req.body);

    res.status(200).json({ message: "Login Successfully", token, user });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Login failed!" });
  }
};
