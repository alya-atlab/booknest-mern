import { Request, Response } from "express";
import { addToCart as addToCartService } from "../services/cart.service";
import { ApiError } from "../utils/ApiError";
import { Types } from "mongoose";

export const addToCart = async (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(id);
  const bookIdInput = req.body.bookId;
  if (!bookIdInput || !Types.ObjectId.isValid(bookIdInput)) {
    throw new ApiError("Invalid bookId", 400);
  }
  const bookId = new Types.ObjectId(bookIdInput);
  const cart = await addToCartService({ userId, bookId });
  res.status(200).json({
    success: true,
    data: cart,
  });
};
