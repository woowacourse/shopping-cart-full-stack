import * as z from "../utils/z.js";
import {
  createCheckoutRequestSchema,
  updateCheckoutAddressRequestSchema,
  updateCheckoutCouponsRequestSchema,
  couponDiscountPreviewQuerySchema,
  payCheckoutRequestSchema,
} from "../schemas/checkout.schema.js";
import { CouponResponse } from "./coupon.interface.js";

export type CreateCheckoutDto = z.infer<typeof createCheckoutRequestSchema>;
export type UpdateCheckoutAddressDto = z.infer<typeof updateCheckoutAddressRequestSchema>;
export type UpdateCheckoutCouponsDto = z.infer<typeof updateCheckoutCouponsRequestSchema>;
export type CouponDiscountPreviewQuery = z.infer<typeof couponDiscountPreviewQuerySchema>;
export type PayCheckoutDto = z.infer<typeof payCheckoutRequestSchema>;

export interface Checkout {
  id: number;
  remoteArea: boolean;
  createdAt: number;
}

export type newCheckout = Omit<Checkout, "id" | "createdAt">;

export interface CheckoutItem {
  id: number;
  checkoutId: number;
  productId: number;
  quantity: number;
}

export type newCheckoutItem = Omit<CheckoutItem, "id" | "checkoutId">;

export interface CheckoutCoupon {
  id: number;
  checkoutId: number;
  couponId: number;
}

export interface PricedItem {
  productId: number;
  price: number;
  quantity: number;
}

export interface CheckoutItemResponse {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface CheckoutDetailResponse {
  checkoutId: number;
  items: CheckoutItemResponse[];
  coupons: CouponResponse[];
  remoteArea: boolean;
  checkoutAmount: number;
  couponDiscount: number;
  shippingFee: number;
  totalAmount: number;
}

export interface PaymentResultResponse {
  itemCount: number;
  totalQuantity: number;
  totalAmount: number;
}
