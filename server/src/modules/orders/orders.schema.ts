import { AppError } from "@/errors/AppError";

export interface OrderProduct {
  id: number;
  quantity: number;
}

export interface CreateOrderBody {
  products: OrderProduct[];
}

const isOrderProduct = (item: unknown): item is OrderProduct =>
  !!item &&
  typeof item === "object" &&
  "id" in item &&
  "quantity" in item &&
  typeof (item as OrderProduct).id === "number" &&
  typeof (item as OrderProduct).quantity === "number";

export interface PatchOrderCouponBody {
  couponIds: number[];
}

export interface PatchOrderShippingBody {
  isRemoteArea: boolean;
}

export const validatePatchOrderCoupon = (body: unknown): PatchOrderCouponBody => {
  if (!body || typeof body !== "object") throw new AppError("INVALID_PATCH_ORDER");
  const b = body as Record<string, unknown>;
  if (
    !Array.isArray(b.couponIds) ||
    !b.couponIds.every((id) => typeof id === "number")
  ) throw new AppError("INVALID_PATCH_ORDER");
  return { couponIds: b.couponIds as number[] };
};

export const validatePatchOrderShipping = (body: unknown): PatchOrderShippingBody => {
  if (!body || typeof body !== "object") throw new AppError("INVALID_PATCH_ORDER");
  const b = body as Record<string, unknown>;
  if (typeof b.isRemoteArea !== "boolean") throw new AppError("INVALID_PATCH_ORDER");
  return { isRemoteArea: b.isRemoteArea };
};

export const validateCreateOrder = (body: unknown): CreateOrderBody => {
  if (
    !body ||
    typeof body !== "object" ||
    !("products" in body) ||
    !Array.isArray((body as CreateOrderBody).products) ||
    !(body as CreateOrderBody).products.every(isOrderProduct)
  ) {
    throw new AppError("INVALID_ORDER");
  }

  return body as CreateOrderBody;
};
