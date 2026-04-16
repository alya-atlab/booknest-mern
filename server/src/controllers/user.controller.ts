import {Request, Response } from "express";
import { getUsers as getUsersService } from "../services/user.service";
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsersService();
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch(error) {
    res.status(500).json({ message: "Failed to fetch users" });
    }
};
