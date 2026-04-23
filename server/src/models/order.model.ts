import mongoose, { Schema, Document, Types } from "mongoose";
import { ORDER_STATUS } from "../constants/order.constants";

interface IOrderItems {
  bookId: Types.ObjectId;
  priceAtPurchase: number;
  quantity: number;
}

interface IOrder {
  userId: Types.ObjectId;
  items: IOrderItems[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

const orderItemSchema = new Schema<IOrderItems>({
  bookId: { type: Types.ObjectId, ref: "Book", required: true },
  priceAtPurchase: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ORDER_STATUS, default: "pending" },
  },
  { timestamps: true },
);

const orderModel = mongoose.model<IOrder>("Order", orderSchema);
export default orderModel;
