import { useCallback, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import type { Cart } from "../../types/cart";
import api from "../../api/axios";
import { useAuth } from "../Auth/AuthContext";
import axios from "axios";

type Props = {
  children: React.ReactNode;
};

const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { isAuthenticated } = useAuth();
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setError("");
      return;
    }
    try {
      setIsLoading(true);
      setError("");
      const res = await api.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Something went wrong");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId: string) => {
    await api.post("/cart", {
      bookId,
    });
    await fetchCart();
  };

  const updateItemInCart = async (bookId: string, quantity: number) => {
    await api.put(`/cart/${bookId}`, {
      quantity,
    });
    await fetchCart();
  };
  const removeItemInCart = async (bookId: string) => {
    await api.delete(`/cart/${bookId}`);
    await fetchCart();
  };
  const checkout = async () => {
    await api.post("/orders");
    await fetchCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        fetchCart,
        addToCart,
        updateItemInCart,
        removeItemInCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export default CartProvider;
