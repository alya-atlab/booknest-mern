import { Types } from "mongoose";
import cartModel from "../models/cart.model";
import bookModel from "../models/books.model";
import { ApiError } from "../utils/ApiError";

const createNewCart = async (userId: Types.ObjectId) => {
  const cart = await cartModel.create({ userId });

  return cart;
};
const getCart = async (userId: Types.ObjectId) => {
  let cart = await cartModel.findOne({ userId });
  if (!cart) {
    const newCart = await createNewCart(userId);
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
