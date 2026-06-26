import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
import { OrderProduct } from "../types";

const checkOrderProduct = (
  orderProduct: unknown,
): orderProduct is OrderProduct => {
  if (typeof orderProduct !== "object" || orderProduct === null) {
    return false;
  }
  if (
    !("productId" in orderProduct) ||
    typeof orderProduct.productId !== "string"
  ) {
    return false;
  }
  if (
    !("quantity" in orderProduct) ||
    typeof orderProduct.quantity !== "number"
  ) {
    return false;
  }
  return true;
};

export const validateCreateOrder = (body: unknown): OrderProduct[] => {
  if (!body || typeof body !== "object" || !("orderProducts" in body)) {
    throw createAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  const { orderProducts } = body as { orderProducts: unknown };

  if (!Array.isArray(orderProducts) || orderProducts.length === 0) {
    throw createAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  if (!orderProducts.every(checkOrderProduct)) {
    throw createAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  for (const { quantity } of orderProducts) {
    if (quantity < 1 || quantity > 99) {
      throw createAppError(ERROR_CODES.OUT_OF_RANGE_ORDER_QUANTITY);
    }
  }

  return orderProducts;
};

export const validateUpdateOrder = (
  body: unknown,
): { couponIds: string[] } | { isIsland: boolean } => {
  if (!body || typeof body !== "object") {
    throw createAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
  }

  if ("couponIds" in body) {
    const { couponIds } = body as { couponIds: unknown };
    if (
      !Array.isArray(couponIds) ||
      !couponIds.every((id) => typeof id === "string")
    ) {
      throw createAppError(ERROR_CODES.INVALID_COUPON_IDS);
    }
    return { couponIds };
  }

  if ("isIsland" in body) {
    const { isIsland } = body as { isIsland: unknown };
    if (typeof isIsland !== "boolean") {
      throw createAppError(ERROR_CODES.INVALID_IS_ISLAND);
    }
    return { isIsland };
  }

  throw createAppError(ERROR_CODES.INVALID_ORDER_PRODUCTS);
};

export const validateCouponIds = (body: unknown): string[] => {
  if (!body || typeof body !== "object" || !("couponIds" in body)) {
    throw createAppError(ERROR_CODES.INVALID_COUPON_IDS);
  }

  const { couponIds } = body as { couponIds: unknown };

  if (
    !Array.isArray(couponIds) ||
    !couponIds.every((id) => typeof id === "string")
  ) {
    throw createAppError(ERROR_CODES.INVALID_COUPON_IDS);
  }

  return couponIds;
};
