type OrderItem = {
  _id: string;
  title: string;
  priceAtPurchase: number;
  quantity: number;
};

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}
