import { Request, Response } from "express";
import * as checkoutService from "../services/checkout/index.js";
import {
  createCheckoutRequestSchema,
  updateCheckoutAddressRequestSchema,
  updateCheckoutCouponsRequestSchema,
  couponDiscountPreviewQuerySchema,
  payCheckoutRequestSchema,
} from "../schemas/checkout.schema.js";
import { CheckoutDetailResponse, PaymentResultResponse } from "../interfaces/checkout.interface.js";
import { CouponResponse } from "../interfaces/coupon.interface.js";

export async function createCheckout(request: Request, response: Response): Promise<void> {
  const dto = createCheckoutRequestSchema.parse(request.body);
  const result = await checkoutService.createCheckout(dto);
  response.status(201).json(result);
}

export async function getCheckout(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  const detail = await checkoutService.getCheckout(checkoutId);
  response.status(200).json(toCheckoutDetailBody(detail));
}

export async function deleteCheckout(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  await checkoutService.deleteCheckout(checkoutId);
  response.status(204).end();
}

export async function updateCheckoutAddress(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  const dto = updateCheckoutAddressRequestSchema.parse(request.body);
  await checkoutService.updateCheckoutAddress(checkoutId, dto);
  response.status(204).end();
}

export async function updateCheckoutCoupons(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  const dto = updateCheckoutCouponsRequestSchema.parse(request.body);
  await checkoutService.updateCheckoutCoupons(checkoutId, dto);
  response.status(204).end();
}

export async function getCouponDiscountPreview(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  const query = couponDiscountPreviewQuerySchema.parse({
    couponIds: normalizeCouponIds(request.query.couponIds),
  });
  const result = await checkoutService.getCouponDiscountPreview(checkoutId, query);
  response.status(200).json(result);
}

export async function payCheckout(request: Request, response: Response): Promise<void> {
  const checkoutId = Number(request.params.checkoutId);
  const dto = payCheckoutRequestSchema.parse(request.body);
  const result = await checkoutService.payCheckout(checkoutId, dto);
  response.status(200).json(toPaymentResultBody(result));
}

function toCouponConditionBody(coupon: CouponResponse) {
  return {
    min_order_amount: coupon.minOrderAmount,
    usable_start_at: coupon.usableStartAt,
    usable_end_at: coupon.usableEndAt,
  };
}

function toCouponResponseBody(coupon: CouponResponse) {
  return {
    coupon_id: coupon.couponId,
    name: coupon.name,
    expired_date: coupon.expiredDate,
    ...toCouponConditionBody(coupon),
    is_selected: coupon.isSelected,
    disabled: coupon.disabled,
  };
}

function toCheckoutItemBody(item: CheckoutDetailResponse["items"][number]) {
  return {
    product_id: item.productId,
    name: item.name,
    price: item.price,
    image_url: item.imageUrl,
    quantity: item.quantity,
  };
}

function toCheckoutAmountBody(detail: CheckoutDetailResponse) {
  return {
    checkout_amount: detail.checkoutAmount,
    coupon_discount: detail.couponDiscount,
    shipping_fee: detail.shippingFee,
    total_amount: detail.totalAmount,
  };
}

function toCheckoutDetailBody(detail: CheckoutDetailResponse) {
  return {
    checkout_id: detail.checkoutId,
    items: detail.items.map(toCheckoutItemBody),
    coupons: detail.coupons.map(toCouponResponseBody),
    remote_area: detail.remoteArea,
    ...toCheckoutAmountBody(detail),
  };
}

function toPaymentResultBody(result: PaymentResultResponse) {
  return {
    item_count: result.itemCount,
    total_quantity: result.totalQuantity,
    total_amount: result.totalAmount,
  };
}

function toArray(raw: unknown): unknown[] {
  if (Array.isArray(raw)) {
    return raw;
  }
  return [raw];
}

function normalizeCouponIds(raw: unknown): number[] | undefined {
  if (raw === undefined) {
    return undefined;
  }
  return toArray(raw).map((value) => Number(value));
}
