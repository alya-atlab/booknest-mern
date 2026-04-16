import mongoose, { Schema, Document, Types } from "mongoose";

interface IBook extends Document{
    title: string;
    description: string;
    price: number;
    author: Types.ObjectId;
    coverImage: string;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    author: { type: Types.ObjectId, required: true,ref:"User" },
    coverImage: { type: String },
  },
  { timestamps: true },
);
const bookModel = mongoose.model<IBook>("Book", bookSchema);
export default bookModel;