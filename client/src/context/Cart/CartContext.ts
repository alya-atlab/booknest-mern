import { createContext, useContext } from "react";
import type { Cart } from "../../types/cart";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string;
  fetchCart: () => Promise<void>;
  addToCart: (bookId: string) => Promise<void>;
  updateItemInCart: (bookId: string, quantity: number) => Promise<void>;
  removeItemInCart: (bookId: string) => Promise<void>;
  checkout: () => Promise<void>;
}
export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within an CartProvider");
  }
  return context;
};
