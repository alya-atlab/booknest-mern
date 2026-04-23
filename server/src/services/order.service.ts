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
