import { Types } from "mongoose";
import bookModel from "../models/books.model";
import { ApiError } from "../utils/ApiError";

interface BookInput {
  title: string;
  description: string;
  price: number;

  coverImage: string;
}
export const createBook = async (data: BookInput, author: Types.ObjectId) => {
  const existingBook = await bookModel.findOne({ title: data.title, author });
  if (existingBook) {
    throw new ApiError("Book already exists", 400);
  }
  const createdBook = await bookModel.create({ ...data, author });
  return createdBook;
};
export interface BookFilter {
  author?: Types.ObjectId;
}
export const getBooks = async (
  skip: number,
  limit: number,
  filter: BookFilter,
) => {
  return bookModel
    .find(filter)
    .skip(skip)
    .limit(limit)
    .populate("author", "firstName lastName email");
};

export const getBookByID = async (id: Types.ObjectId) => {
  const book = await bookModel
    .findById(id)
    .populate("author", "firstName lastName email");
  if (!book) {
    throw new ApiError("Book Not Found", 404);
  }
  return book;
};

export const getMyBooks = async (userId: Types.ObjectId) => {
  const books = await bookModel
    .find({ author: userId })
    .populate("author", "firstName lastName email");
  return books;
};

export const checkOwnership = async (
  bookId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "admin" | "author" | "user",
) => {
  const book = await bookModel.findById(bookId);
  if (!book) {
    throw new ApiError("Book Not Found", 404);
  }
  if (role === "admin") {
    return book;
  }
  if (!book.author.equals(userId)) {
    throw new ApiError("Forbidden", 403);
  }
  return book;
};
export const deleteBook = async (
  bookId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "admin" | "author" | "user",
) => {
  const book = await checkOwnership(bookId, userId, role);
  await book.deleteOne();
};
export interface BookUpdateInput {
  title?: string;
  description?: string;
  price?: number;
  coverImage?: string;
}
export const updateBook = async (
  bookId: Types.ObjectId,
  userId: Types.ObjectId,
  role: "admin" | "author" | "user",
  cleanData: Partial<BookUpdateInput>,
) => {
  const book = await checkOwnership(bookId, userId, role);
  Object.assign(book, cleanData);
  await book.save();
  return book;
};
