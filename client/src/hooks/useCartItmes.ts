import { useEffect, useState } from "react";
import useFetch from "./useFetch";
import { CartItem } from "../type/types";
import { shoppingCartApi } from "../api/shoppingCartApi";

export default function useCartItmes() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { state, fetchData } = useFetch<CartItem[]>("/cart");

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
      alert("상품 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const onQuantityChange = (cartItemId: number, newQuantity: number) => {
    const newCartItems = cartItems.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(newCartItems);
  };

  return { state, cartItems, setCartItems, onDelete, onQuantityChange };
}
