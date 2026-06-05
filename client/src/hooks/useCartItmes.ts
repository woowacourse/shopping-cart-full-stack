import { useEffect } from "react";
import useFetch from "./useFetch";
import { CartItem } from "../type/types";
import { shoppingCartApi } from "../api/shoppingCartApi";

interface Props {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  setSelectedItems: (map: Map<number, boolean>) => void;
}

export default function useCartItmes({
  setCartItems,
  setSelectedItems,
  cartItems,
}: Props) {
  const { state, fetchData } = useFetch<CartItem[]>("/cart");

  useEffect(() => {
    if (state.status !== "success") return;

    const data = state.data;
    setCartItems(data);

    const stored = localStorage.getItem("storedCartItems");
    if (stored) {
      setSelectedItems(new Map<number, boolean>(JSON.parse(stored)));
    } else {
      setSelectedItems(
        new Map(data.map((item): [number, boolean] => [item.cartItemId, true])),
      );
    }
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

  return { state, onDelete, onQuantityChange };
}
