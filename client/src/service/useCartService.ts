import { useCallback, useEffect, useState } from "react";
import type { CartApiInterface } from "../infrastructure/interfaces/CartApiInterface";
import type { CartItem } from "../domain/Types";

export const useCartService = (api: CartApiInterface) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCartItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCartItems();
      setCartItems(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "장바구니 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    loadCartItems();
    
    const handleFocus = () => loadCartItems();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadCartItems]);

  const changeQuantity = async (id: number, quantity: number) => {
    const prevItems = [...cartItems];

    // 낙관적 업데이트
    setCartItems((items) =>
      items.map((item) =>
        item.cartItemId === id ? { ...item, quantity } : item,
      ),
    );

    try {
      await api.updateCartItemQuantity(id, quantity);
    } catch (e) {
      setCartItems(prevItems);
      alert("수량 변경에 실패했습니다.");
    }
  };

  const removeCartItem = async (id: number) => {
    const prevItems = [...cartItems];

    setCartItems((items) => items.filter((item) => item.cartItemId !== id));

    try {
      await api.deleteCartItem(id);
    } catch (e) {
      setCartItems(prevItems);
      alert("상품 제거에 실패했습니다.");
    }
  };

  return {
    cartItems,
    isLoading,
    error,
    changeQuantity,
    removeCartItem,
  };
};
