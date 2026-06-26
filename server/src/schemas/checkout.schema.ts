import { z } from "../utils/z.js";
import { ERROR_RESPONSE } from "../constants/error.js";

const checkoutItemRequestSchema = z.object({
  product_id: z
    .number({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code })
    .int(ERROR_RESPONSE.INVALID_REQUEST_BODY.code)
    .positive(ERROR_RESPONSE.INVALID_REQUEST_BODY.code),
  quantity: z
    .number({ error: ERROR_RESPONSE.INVALID_QUANTITY.code })
    .int(ERROR_RESPONSE.INVALID_QUANTITY.code)
    .min(1, ERROR_RESPONSE.INVALID_QUANTITY.code)
    .max(99, ERROR_RESPONSE.INVALID_QUANTITY.code),
});

export const createCheckoutRequestSchema = z.object({
  items: z.array(checkoutItemRequestSchema).minLength(1, ERROR_RESPONSE.INVALID_REQUEST_BODY.code),
});

export const updateCheckoutAddressRequestSchema = z.object({
  remote_area: z.boolean({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code }),
});

export const updateCheckoutCouponsRequestSchema = z.object({
  coupons: z.nullable(
    z.array(
      z
        .number({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code })
        .int(ERROR_RESPONSE.INVALID_REQUEST_BODY.code)
        .positive(ERROR_RESPONSE.INVALID_REQUEST_BODY.code),
    ),
  ),
});

export const couponDiscountPreviewQuerySchema = z.object({
  couponIds: z.optional(
    z.array(
      z
        .number({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code })
        .int(ERROR_RESPONSE.INVALID_REQUEST_BODY.code)
        .positive(ERROR_RESPONSE.INVALID_REQUEST_BODY.code),
    ),
  ),
});

export const payCheckoutRequestSchema = z.object({
  remote_area: z.boolean({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code }),
  coupons: z.nullable(
    z.array(
      z
        .number({ error: ERROR_RESPONSE.INVALID_REQUEST_BODY.code })
        .int(ERROR_RESPONSE.INVALID_REQUEST_BODY.code)
        .positive(ERROR_RESPONSE.INVALID_REQUEST_BODY.code),
    ),
  ),
});
