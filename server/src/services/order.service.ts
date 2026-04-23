import { Types } from "mongoose";
import { getCart } from "./cart.service";
import { ApiError } from "../utils/ApiError";
import orderModel from "../models/order.model";
import bookModel from "../models/books.model";

export const checkout = async (userId: Types.ObjectId) => {
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw new ApiError("Cart is empty", 400);
  }

  const orderItems = [];
  let totalAmount = 0;
  for (const item of cart.items) {
    const bookId = item.bookId;
    const book = await bookModel.findById(bookId);
    if (!book) {
      throw new ApiError("Book not found", 404);
    }
    const price = book.price;
    totalAmount += price * item.quantity;
    orderItems.push({
      bookId,
      priceAtPurchase: price,
      quantity: item.quantity,
    });
  }
  const order = await orderModel.create({
    userId,
    items: orderItems,
    totalAmount,
  });
  cart.items = [];
  await cart.save();
  return order;
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
