import { useEffect, useState } from "react";
import type { CartItemType } from "../types/cart";
import { useCartMutation } from "./useCartMutation";

interface CartApi {
  fetchCart: () => Promise<CartItemType[]>;
  updateCart: (productId: number, quantity: number) => Promise<boolean>;
  deleteCart: (productId: number) => Promise<boolean>;
}

export function useCart({ fetchCart, updateCart, deleteCart }: CartApi) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCart();
        setCartItems(data);
      } catch {
        setError("장바구니를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchCart]);

  const { updateQuantity, deleteItem } = useCartMutation(
    cartItems,
    setCartItems,
    { updateCart, deleteCart },
  );

  return { loading, error, cartItems, updateQuantity, deleteItem };
}
