import { Request, Response } from "express";
import {
  getUsers as getUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
} from "../services/user.service";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";
export const getUsers = async (req: Request, res: Response) => {
  const users = await getUsersService();
  res.status(200).json({ success: true, data: users });
};
interface Params {
  id?: string;
}
export const getUserById = async (req: Request<Params>, res: Response) => {
  const { id } = req.params;
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid ID", 400);
  }
  const currentUser = req.user;
  if (!currentUser) {
    throw new ApiError("Unauthorized", 401);
  }
  if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
    throw new ApiError("Forbidden", 403);
  }
  const userId = new Types.ObjectId(id);
  const targetUser = await getUserByIdService(userId);
  res.status(200).json({
    success: true,
    data: targetUser,
  });
};

export const updateUser = async (req: Request<Params>, res: Response) => {
  const { id } = req.params;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid ID", 400);
  }
  const currentUser = req.user;
  if (!currentUser) throw new ApiError("Unauthorized", 401);
  if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
    throw new ApiError("Forbidden", 403);
  }
  const userId = new Types.ObjectId(id);
  const newData = await updateUserService(userId, req.body);
  res.status(200).json({
    success: true,
    data: newData,
  });
};
