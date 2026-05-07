import { ClientSession, Types } from "mongoose";
import cartModel from "../models/cart.model";
import bookModel from "../models/books.model";
import { ApiError } from "../utils/ApiError";

const createNewCart = async (
  userId: Types.ObjectId,
  session?: ClientSession,
) => {
  const cart = await cartModel.create([{ userId }], {
    session: session ?? null,
  });

  return cart[0];
};
export const getCart = async (
  userId: Types.ObjectId,
  session?: ClientSession,
) => {
  let cart = await cartModel
    .findOne({ userId })
    .session(session ?? null)
    .populate("items.bookId", "title price author coverImage");
  if (!cart) {
    const newCart = await createNewCart(userId, session);
    return newCart;
  }
  return cart;
};
interface AddToCartInput {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
}
export const addToCart = async ({ userId, bookId }: AddToCartInput) => {
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw new ApiError("Book not found", 404);
  }
  if (book.stock === 0) {
    throw new ApiError("Out of stock", 400);
  }
  const userCart = await getCart(userId);
  const existingItem = userCart.items.find((item) =>
    item.bookId.equals(bookId),
  );
  if (existingItem) {
    if (existingItem.quantity + 1 > book.stock) {
      throw new ApiError("Requested quantity exceeds available stock", 400);
    }
    existingItem.quantity += 1;
  } else {
    userCart.items.push({ bookId, quantity: 1 });
  }
  await userCart.save();
  return userCart;
};

interface UpdateItemInput {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
  quantity: number;
}
export const updateItem = async ({
  userId,
  bookId,
  quantity,
}: UpdateItemInput) => {
  const cart = await cartModel.findOne({ userId });
  if (!cart) {
    throw new ApiError("Cart not found", 404);
  }
  const item = cart.items.find((item) => item.bookId.equals(bookId));
  if (!item) {
    throw new ApiError("Item not found", 404);
  }
  if (quantity < 0) {
    throw new ApiError("Quantity cannot be negative", 400);
  }
  if (quantity === 0) {
    cart.items = cart.items.filter((i) => !i.bookId.equals(bookId));
    await cart.save();
    return cart;
  }
  const book = await bookModel.findById(bookId, { stock: 1 });
  if (!book) {
    throw new ApiError("Book not found", 404);
  }
  if (book.stock === 0) {
    throw new ApiError("Out of stock", 400);
  }
  if (quantity > book.stock) {
    throw new ApiError("Requested quantity exceeds available stock", 400);
  }
  item.quantity = quantity;
  await cart.save();
  return cart.populate("items.bookId", "title price author coverImage");
};
interface DeleteItemInput {
  userId: Types.ObjectId;
  bookId: Types.ObjectId;
}
export const deleteItem = async ({ userId, bookId }: DeleteItemInput) => {
  const cart = await getCart(userId);
  const item = cart.items.find((item) => item.bookId.equals(bookId));
  if (!item) {
    throw new ApiError("Item not found", 404);
  }
  cart.items = cart.items.filter((i) => !i.bookId.equals(bookId));
  await cart.save();
  return cart;
};
