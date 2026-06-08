import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { CartItem } from "../type/types";
import { shoppingCartApi, BASE_URL } from "../api/shoppingCartApi";
import { ERROR_MESSAGES } from "../constants/messages";

export default function useCartItmes() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { state, fetchData } = useFetch<CartItem[]>(`${BASE_URL}/cart`);

  useEffect(() => {
    if (state.status !== "success") return;
    setCartItems(state.data);
  }, [state]);

  const onDelete = async (cartItemId: number) => {
    try {
      const res = await shoppingCartApi.delete(cartItemId);
      if (!res.ok) throw new Error();
      fetchData();
    } catch {
      alert(ERROR_MESSAGES.DELETE_ERROR_MESSAGE);
    }
  };

  const onQuantityChange = async (cartItemId: number, newQuantity: number) => {
    try {
      const res = await shoppingCartApi.patch(cartItemId, newQuantity);
      if (!res.ok) throw new Error();
      const newCartItems = cartItems.map((item) => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(newCartItems);
    } catch {
      alert(ERROR_MESSAGES.PATCH_ERROR_MESSAGE);
    }
  };
  return { state, cartItems, onDelete, onQuantityChange };
}
