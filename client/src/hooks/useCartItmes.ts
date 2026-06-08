import { useEffect, useRef, useState } from "react";
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

  const timeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onQuantityChange = (cartItemId: number, newQuantity: number) => {
    const prevCartItems = cartItems;
    const newCartItems = cartItems.map((item) => {
      return item.cartItemId === cartItemId
        ? { ...item, quantity: newQuantity }
        : item;
    });

    setCartItems(newCartItems);
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(async () => {
      try {
        const res = await shoppingCartApi.patch(cartItemId, newQuantity);
        if (!res.ok) throw new Error();
      } catch {
        setCartItems(prevCartItems);
        alert(ERROR_MESSAGES.PATCH_ERROR_MESSAGE);
      }
    }, 500);
  };
  return { state, cartItems, onDelete, onQuantityChange };
}
