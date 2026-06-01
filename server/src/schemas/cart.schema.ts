import * as z from "zod";
import { CART_ERROR_RESPONSE } from "../constants/error.js";

export const updateCartItemRequestSchema = z.object({
  quantity: z
    .number({ error: CART_ERROR_RESPONSE.REQUIRED_CART_ITEM_QUANTITY.code })
    .min(1, CART_ERROR_RESPONSE.INVALID_CART_ITEM_QUANTITY.code),
});
