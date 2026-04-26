import { Request, Response } from "express";
import {
  checkout as checkoutService,
  getOrders as getOrdersService,
  getMyOrders as getMyOrdersService,
  getOrderById as getOrderByIdService,
  updateStatus as updateStatusService,
  getOrdersForAuthor as getOrdersForAuthorService,
} from "../services/order.service";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { getUserById } from "./user.controller";
import { OrderStatus } from "../constants/order.constants";

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

export const getOrders = async (req: Request, res: Response) => {
  const orders = await getOrdersService();
  res.status(200).json({
    success: true,
    data: orders,
  });
};

export const getMyOrders = async (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Unauthorized", 401);
  }
  const userId = new Types.ObjectId(id);
  const orders = await getMyOrdersService(userId);
  res.status(200).json({
    success: true,
    data: orders,
  });
};

export const getOrderById = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new ApiError("Unauthorized", 401);
  if (!Types.ObjectId.isValid(user._id)) {
    throw new ApiError("Invalid Id", 400);
  }
  const userId = new Types.ObjectId(user._id);

  const { id } = req.params;
  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid orderId", 400);
  }
  const orderId = new Types.ObjectId(id);
  const order = await getOrderByIdService({
    userId,
    userRole: user.role,
    orderId,
  });
  res.status(200).json({
    success: true,
    data: order,
  });
};

export const updateStatus = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new ApiError("Unauthorized", 401);
  const userRole = user.role;

  const { id } = req.params;
  if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
    throw new ApiError("Invalid orderId", 400);
  }
  const orderId = new Types.ObjectId(id);
  const newStatus = req.body.status as OrderStatus;
  if (typeof newStatus !== "string") {
    throw new ApiError("Order status is required in request body", 400);
  }
  const order = await updateStatusService({ userRole, orderId, newStatus });
  res.status(200).json({
    success: true,
    data: order,
  });
};
export const getOrdersForAuthor = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new ApiError("Unauthorized", 401);
   if (!Types.ObjectId.isValid(user._id)) {
     throw new ApiError("Invalid Id", 400);
   }
  const userId = new Types.ObjectId(user._id);
  const orders = await getOrdersForAuthorService(userId);
    res.status(200).json({
      success: true,
      data: orders,
    });
 }
  