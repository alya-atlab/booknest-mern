import { Request, Response } from "express";
import {
  createBook as createBookService,
  getBooks as getBooksService,
  getBookByID as getBookByIDService,
  deleteBook as deleteBookService,
  updateBook as updateBookService,
  BookUpdateInput,
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
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const bookId = new Types.ObjectId(id);
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const userId = new Types.ObjectId(user._id);
    const userRole = user.role;
    await deleteBookService(bookId, userId, userRole);
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Book Not Found") {
      return res.status(404).json({ message: "Book Not Found" });
    }
    if (error instanceof Error && error.message === "Forbidden") {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(500).json({ message: "Failed to delete the book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const bookId = new Types.ObjectId(id);
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const userId = new Types.ObjectId(user._id);
    const userRole = user.role;

    const body = req.body;
    const cleanData: Partial<BookUpdateInput> = {};
    
    const allowedFields: (keyof BookUpdateInput)[] = [
      "title",
      "description",
      "price",
      "coverImage",
    ];
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        cleanData[key] = body[key];
      }
    }
   if (Object.keys(cleanData).length === 0) {
     return res.status(400).json({ message: "No valid fields to update" });
   }
    
    const book = await updateBookService(bookId, userId, userRole, cleanData);
    return res
      .status(200)
      .json({ message: "Book updated successfully", book });
  } catch (error) {
     if (error instanceof Error && error.message === "Book Not Found") {
       return res.status(404).json({ message: "Book Not Found" });
     }
     if (error instanceof Error && error.message === "Forbidden") {
       return res.status(403).json({ message: "Forbidden" });
     }
     return res.status(500).json({ message: "Failed to  update the book" });
  }
};
