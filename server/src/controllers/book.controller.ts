import { Request, Response } from "express";
import {
  createBook as createBookService,
  getBooks as getBooksService,
  getBookByID as getBookByIDService,
} from "../services/book.service";
import { Types } from "mongoose";

export const createBook = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const data = req.body;
    const authorId = new Types.ObjectId(user._id);
    const createdBook = await createBookService(data, authorId);
    res
      .status(201)
      .json({ message: "Book created successfully", data: createdBook });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Creation of book failed!" });
  }
};
export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await getBooksService();
    res.status(200).json({ message: "Books fetched successfully", books });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
};
export const getBookByID = async (req: Request, res: Response) => {
  try {
   const { id } = req.params;

   if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
     return res.status(400).json({ message: "Invalid ID" });
   }
      const bookId = new Types.ObjectId(id);
    
    const book = await getBookByIDService(bookId);
    res.status(200).json({ message: "Book fetched successfully", book });
  } catch (error) {
    if (error instanceof Error && error.message === "Book Not Found") {
     return res.status(404).json({ message: "Book Not Found" });
    }
     res.status(500).json({ message: "Failed to fetch the book" });
  }
};
