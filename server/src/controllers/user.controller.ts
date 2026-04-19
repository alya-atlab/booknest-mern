import { Request, Response } from "express";
import { getUsers as getUsersService } from "../services/user.service";
export const getUsers = async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.status(200).json({ success: true, data: users });
};
