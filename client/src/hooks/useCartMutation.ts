import type { Dispatch, SetStateAction } from "react";
import type { CartItemType } from "../types/cart";

interface CartApi {
  updateCart: (productId: number, quantity: number) => Promise<boolean>;
  deleteCart: (productId: number) => Promise<boolean>;
}

export function useCartMutation(
  cartItems: CartItemType[],
  setCartItems: Dispatch<SetStateAction<CartItemType[]>>,
  { updateCart, deleteCart }: CartApi,
) {
  async function updateQuantity(productId: number, quantity: number) {
    const prevItems = cartItems;
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
    try {
      const success = await updateCart(productId, quantity);
      if (!success) throw new Error("update-failed");
    } catch {
      setCartItems(prevItems);
      alert("장바구니 상품 수량 업데이트에 실패하였습니다. 다시 시도해주세요.");
    }
  }

  async function deleteItem(productId: number) {
    const prevItems = cartItems;
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
    try {
      const success = await deleteCart(productId);
      if (!success) throw new Error("delete-failed");
    } catch {
      setCartItems(prevItems);
      alert("장바구니 상품 삭제에 실패하였습니다. 다시 시도해주세요.");
    }
  }

  return { updateQuantity, deleteItem } as const;
}
