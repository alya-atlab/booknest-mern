import { Types } from "mongoose";
import bookModel from "../models/books.model";

interface BookInput {
  title: string;
  description: string;
  price: number;

  coverImage: string;
}
export const createBook = async (data: BookInput, author: Types.ObjectId) => {
  const existingBook = await bookModel.findOne({ title: data.title,author });
  if (existingBook) {
    throw new Error("Book already exists");
  }
  const createdBook = await bookModel.create({ ...data, author });
  return createdBook;
};
