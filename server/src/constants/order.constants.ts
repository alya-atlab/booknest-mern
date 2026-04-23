export const ORDER_STATUS = ["pending", "processing", "cancelled", "completed"];
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["completed"],
  completed: [],
  cancelled: [],
};
