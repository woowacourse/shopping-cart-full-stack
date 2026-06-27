import { cartItemSchema, type CartItem } from "../types";
import { apiRequest, ApiError } from "../../../shared/api/httpClient";
import { z } from "../../../shared/schema";

const cartListSchema = z.array(cartItemSchema);

export async function getCart(): Promise<CartItem[]> {
  const data = await apiRequest("/carts"); // 응답은 unknown — 경계에서 신뢰하지 않는다
  const result = cartListSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(500, "InvalidResponse", "장바구니 응답 형식이 올바르지 않습니다");
  }
  return result.data;
}

export function updateQuantity(
  id: string,
  quantity: number,
): Promise<CartItem> {
  return apiRequest<CartItem>(`/carts/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: string): Promise<void> {
  return apiRequest<void>(`/carts/${id}`, {
    method: "DELETE",
  });
}
