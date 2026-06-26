import type { CartItemStatus } from "../../domain/cart";

export interface CartItemResponse {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
  status: CartItemStatus;
}

export interface GetCartResponse {
  data: CartItemResponse[];
}

export interface PatchCartItemRequest {
  quantity: number;
}
