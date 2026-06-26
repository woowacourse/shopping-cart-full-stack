import type { CartItem } from "../../domain/Types";
import type { CartApiInterface } from "../interfaces/CartApiInterface";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchCartApi: CartApiInterface = {
  getCartItems: async (): Promise<CartItem[]> => {
    const response = await fetch(`${BASE_URL}/cart`);
    if (!response.ok) throw new Error("장바구니 목록을 불러오지 못했습니다.");

    return response.json();
  },

  updateCartItemQuantity: async (
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem> => {
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    if (!response.ok) throw new Error("수량 변경에 실패했습니다.");

    return response.json();
  },

  deleteCartItem: async (cartItemId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("장바구니 상품 삭제에 실패했습니다.");
  },
};
