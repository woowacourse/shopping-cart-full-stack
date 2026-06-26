import * as z from "../utils/z.js";
import { updateCartItemRequestSchema } from "../schemas/cart.schema.js";

export type UpdateCartItemDto = z.infer<typeof updateCartItemRequestSchema>;

export type newCartItem = Omit<CartItem, "id">;

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export const CART_ITEM_STATUS = {
  AVAILABLE: "available",
  OUT_OF_STOCK: "outOfStock",
  QUANTITY_EXCEEDED: "quantityExceeded",
} as const;

export type CartItemStatus = (typeof CART_ITEM_STATUS)[keyof typeof CART_ITEM_STATUS];

export interface CartItemResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  status: CartItemStatus;
  image_url: string;
}

export type UpdateResultKey = "CART_ITEM_NOT_FOUND" | "PRODUCT_NOT_FOUND" | "OUT_OF_STOCK";
