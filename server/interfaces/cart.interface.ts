import * as z from "zod";
import { updateCartItemRequestSchema } from "../src/schemas/cart.schema.js";

export type UpdateCartItemDto = z.infer<typeof updateCartItemRequestSchema>;

export type newCartItem = Omit<CartItem, "id">;
export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}
