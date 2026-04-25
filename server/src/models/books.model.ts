import mongoose, { Schema, Document, Types } from "mongoose";

interface IBook extends Document {
  title: string;
  description: string;
  price: number;
  author: Types.ObjectId;
  coverImage: string;
  stock: number;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    author: { type: Types.ObjectId, required: true, ref: "User" },
    coverImage: { type: String },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);
const bookModel = mongoose.model<IBook>("Book", bookSchema);
export default bookModel;
