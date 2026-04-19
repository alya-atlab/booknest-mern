import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const registerUser = async (req: Request, res: Response) => {
  
  const { token, user } = await authService.registerUser(req.body);
  res.status(201).json({ success: true, data: { token, user } });
};

export const loginUser = async (req: Request, res: Response) => {
  const { token, user } = await authService.loginUser(req.body);

  res.status(200).json({ success: true,data:{token, user } });
};
