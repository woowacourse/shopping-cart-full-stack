import * as z from "zod";
import { updateCartItemRequestSchema } from "../schemas/cart.schema.js";

export type UpdateCartItemDto = z.infer<typeof updateCartItemRequestSchema>;

export type newCartItem = Omit<CartItem, "id">;
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}
