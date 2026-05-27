import * as z from "zod";
import { ERROR_RESPONSE } from "../constants/error.js";

export const updateCartItemRequestSchema = z.object({
  quantity: z
    .number({ error: ERROR_RESPONSE.REQUIRED_CART_ITEM_QUANTITY.code })
    .min(1, ERROR_RESPONSE.INVALID_CART_ITEM_QUANTITY.code),
});
