import mongoose, { Types } from "mongoose";
import { getCart } from "./cart.service";
import { ApiError } from "../utils/ApiError";
import orderModel from "../models/order.model";
import bookModel from "../models/books.model";
import {
  ORDER_STATUS,
  ALLOWED_TRANSITIONS,
  OrderStatus,
} from "../constants/order.constants";

export const checkout = async (userId: Types.ObjectId) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const cart = await getCart(userId, session);
    if (cart.items.length === 0) {
      throw new ApiError("Cart is empty", 400);
    }
    const orderItems = [];
    let totalAmount = 0;
    for (const item of cart.items) {
      const bookId = item.bookId;
      const quantity = item.quantity;
      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new ApiError("Invalid quantity", 400);
      }
      const result = await bookModel.findOneAndUpdate(
        {
          _id: bookId,
          stock: { $gte: quantity },
        },
        {
          $inc: { stock: -quantity },
        },
        { new: true, session },
      );
      if (!result) {
        throw new ApiError("Book not available or insufficient stock", 409);
      }

      const price = result.price;

      totalAmount += price * quantity;
      orderItems.push({
        bookId,
        priceAtPurchase: price,
        quantity,
        authorId: result.author,
        title: result.title,
      });
    }
    const order = await orderModel.create(
      [
        {
          userId,
          items: orderItems,
          totalAmount,
        },
      ],
      { session },
    );
    cart.items = [];
    await cart.save({ session });
    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Cannot create order", 500);
  } finally {
    session.endSession();
  }
};

export const getOrders = async () => {
  return orderModel.find().sort({ createdAt: -1 });
};

export const getMyOrders = async (userId: Types.ObjectId) => {
  return orderModel.find({ userId }).sort({ createdAt: -1 });
};
interface getOrderInput {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  userRole: "admin" | "author" | "user";
}
export const getOrderById = async ({
  orderId,
  userId,
  userRole,
}: getOrderInput) => {
  const order = await orderModel.findById(orderId);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }
  if (userRole !== "admin" && !order.userId.equals(userId)) {
    throw new ApiError("Forbidden", 403);
  }
  return order;
};

interface UpdateStatusInput {
  userRole: "admin" | "author" | "user";
  orderId: Types.ObjectId;
  newStatus: OrderStatus;
}

export const updateStatus = async ({
  userRole,
  orderId,
  newStatus,
}: UpdateStatusInput) => {
  if (userRole !== "admin") {
    throw new ApiError("Forbidden", 403);
  }
  if (!ORDER_STATUS.includes(newStatus)) {
    throw new ApiError(
      `Invalid status. Must be one of: ${ORDER_STATUS.join(", ")}`,
      400,
    );
  }
  const order = await orderModel.findById(orderId);
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  const currentStatus = order.status as OrderStatus;
  if (currentStatus === newStatus) {
    throw new ApiError(`Order is already in status ${currentStatus}`, 400);
  }
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  if (!allowed.includes(newStatus)) {
    throw new ApiError(
      `Cannot change order status from ${currentStatus} to ${newStatus}`,
      400,
    );
  }
  order.status = newStatus as any;
  await order.save();
  return order;
};
type Items = {
  title: string;
  price: number;
  quantity: number;
};
export const getOrdersForAuthor = async (authorId: Types.ObjectId) => {
  const orders = await orderModel
    .find({ "items.authorId": authorId })
    .sort({ createdAt: -1 })
    .lean();
  const stringifyAuthorId = authorId.toString();

  let authorOrders = orders.map((order) => {
    const items: Items[] = [];
    let authorOrderTotal = 0;

    for (let item of order.items) {
      if (item.authorId.toString() === stringifyAuthorId) {
        items.push({
          title: item.title,
          price: item.priceAtPurchase,
          quantity: item.quantity,
        });
        authorOrderTotal += item.priceAtPurchase * item.quantity;
      }
    }
    if (items.length === 0) {
      return;
    }
    return {
      items,
      authorOrderTotal,
      orderId: order._id.toString(),
      createdAt: order.createdAt.toISOString(),
      status: order.status,
    };
  });
  authorOrders = authorOrders.filter(Boolean);
  return authorOrders;
};
