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
  const userCart = await getCart(userId);
  const existingItem = userCart.items.find((item) =>
    item.bookId.equals(bookId),
  );
  if (existingItem) {
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
  const cart = await getCart(userId);
  const item = cart.items.find((item) => item.bookId.equals(bookId));
  if (!item) {
    throw new ApiError("Item not found", 404);
  }
  if (quantity === 0) {
    cart.items = cart.items.filter((i) => !i.bookId.equals(bookId));
    await cart.save();
    return cart;
  }
  item.quantity = quantity;
  await cart.save();
  return cart;
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
