import mongoose, { Schema, Document, Types } from "mongoose";

interface IItems {
  bookId: Types.ObjectId;
  quantity: number;
}
interface ICart {
  userId: Types.ObjectId;
  items: IItems[];
}
const itemSchema = new Schema<IItems>({
  bookId: { type: Types.ObjectId, required: true, ref: "Book" },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});
const cartSchema = new Schema<ICart>(
  {
    userId: { type: Types.ObjectId, required: true, ref: "User", unique: true },
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: true },
);
const cartModel = mongoose.model<ICart>("Cart", cartSchema);
export default cartModel;
