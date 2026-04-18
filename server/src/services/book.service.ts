import { Types } from "mongoose";
import bookModel from "../models/books.model";

interface BookInput {
  title: string;
  description: string;
  price: number;

  coverImage: string;
}
export const createBook = async (data: BookInput, author: Types.ObjectId) => {
  const existingBook = await bookModel.findOne({ title: data.title, author });
  if (existingBook) {
    throw new Error("Book already exists");
  }
  const createdBook = await bookModel.create({ ...data, author });
  return createdBook;
};
export const getBooks = async () => {
  return bookModel.find().populate("author", "firstName lastName email");
};

export const getBookByID = async (id: Types.ObjectId) => {
  const book = await bookModel
    .findById(id)
    .populate("author", "firstName lastName email");
  if (!book) {
    throw new Error("Book Not Found");
  }
  return book;
};
