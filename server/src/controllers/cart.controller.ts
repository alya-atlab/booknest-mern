import { Request, Response } from "express";
import {
  addToCart as addToCartService,
  getCart as getCartService,
  updateItem as updateItemService,
  deleteItem as deleteItemService,
} from "../services/cart.service";
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
    throw new ApiError("Invalid book Id", 400);
  }
  const bookId = new Types.ObjectId(bookIdInput);
  const cart = await addToCartService({ userId, bookId });
  res.status(200).json({
    success: true,
    data: cart,
  });
};
export const getCart = async (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(id);
  const cart = await getCartService(userId);
  res.status(200).json({
    success: true,
    data: cart,
  });
};
interface Params {
  bookId?: string;
}
export const updateItem = async (req: Request<Params>, res: Response) => {
  const userIdInput = req.user?._id;
  if (!userIdInput || !Types.ObjectId.isValid(userIdInput)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(userIdInput);
  const { bookId } = req.params;

  if (!bookId || !Types.ObjectId.isValid(bookId)) {
    throw new ApiError("Invalid book Id", 400);
  }
  const bookIdObj = new Types.ObjectId(bookId);
  const quantity = req.body.quantity;
  if (typeof quantity != "number") {
    throw new ApiError("Quantity must be number", 400);
  }
  const cart = await updateItemService({ userId, bookId: bookIdObj, quantity });
  res.status(200).json({
    success: true,
    data: cart,
  });
};
export const deleteItem = async (req: Request<Params>, res: Response) => {
  const userIdInput = req.user?._id;
  if (!userIdInput || !Types.ObjectId.isValid(userIdInput)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(userIdInput);
  const { bookId } = req.params;

  if (!bookId || !Types.ObjectId.isValid(bookId)) {
    throw new ApiError("Invalid book Id", 400);
  }
  const bookIdObj = new Types.ObjectId(bookId);
  const cart = await deleteItemService({ userId, bookId: bookIdObj });
  res.status(200).json({
    success: true,
    data: cart,
  });
};
