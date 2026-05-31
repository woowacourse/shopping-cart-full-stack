import * as z from "zod";
import { PRODUCT_ERROR_RESPONSE } from "../constants/error.js";

export const createProductRequestSchema = z.object({
  name: z
    .string({
      error: PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_NAME.code,
    })
    .min(1, PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_NAME.code)
    .max(100, PRODUCT_ERROR_RESPONSE.INVALID_PRODUCT_NAME.code),

  stock: z
    .number({
      error: PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_STOCK.code,
    })
    .int(PRODUCT_ERROR_RESPONSE.INVALID_PRODUCT_STOCK.code)
    .min(1, PRODUCT_ERROR_RESPONSE.INVALID_PRODUCT_STOCK.code)
    .max(99, PRODUCT_ERROR_RESPONSE.INVALID_PRODUCT_STOCK.code),

  imageUrl: z
    .string({
      error: PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_IMAGE.code,
    })
    .min(1, PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_IMAGE.code),

  price: z
    .number({
      error: PRODUCT_ERROR_RESPONSE.REQUIRED_PRODUCT_PRICE.code,
    })
    .positive(PRODUCT_ERROR_RESPONSE.INVALID_PRODUCT_PRICE.code),
});

const productResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  stock: z.number(),
  imageUrl: z.string(),
  price: z.number(),
});

export const productListResponseSchema = z.array(productResponseSchema);
