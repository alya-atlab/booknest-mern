import { Request, Response } from "express";
import { checkout as checkoutService } from "../services/order.service";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";

export const checkout = async (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(id);
  const order = await checkoutService(userId);
  res.status(201).json({
    success: true,
    data: order,
  });
};
