import { Request, Response } from "express";
import { createBook as createBookService } from "../services/book.service";
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
