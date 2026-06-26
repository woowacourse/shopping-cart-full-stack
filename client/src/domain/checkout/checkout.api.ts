import { BASE_URL, throwApiError, type ApiResponse } from "../../shared/api";

import type { CartItemModel } from "../cart/cart.api";

export type CheckoutItem = CartItemModel;

export type CheckoutContent = {
  checkoutId: number;
  checkoutItems: CheckoutItem[];
  appliedCouponIds: number[];
  remoteArea: boolean;
  orderPrice: number;
  couponDiscountPrice: number;
  deliveryFee: number;
  totalPrice: number;
};

export type CheckoutCoupon = {
  id: number;
  name: string;
  type: string;
  expiryDate: string;
  fixedDiscountPrice: number | null;
  fixedDiscountRate: number | null;
  minAmount: number | null;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
};

export type CheckoutRemoteAreaResponse = Pick<
  CheckoutContent,
  "remoteArea" | "couponDiscountPrice" | "deliveryFee" | "totalPrice"
>;

export type CheckoutApplyCouponResponse = Pick<
  CheckoutContent,
  "appliedCouponIds" | "couponDiscountPrice" | "deliveryFee" | "totalPrice"
>;

export type CheckoutCouponResponse = {
  coupons: CheckoutCoupon[];
  recommendedCouponIds: CheckoutContent["appliedCouponIds"];
};

export const createCheckout = async (
  cartId: number,
  selectedProductIds: number[],
): Promise<number> => {
  const response = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cartId,
      selectedProductIds,
    }),
  });

  if (!response.ok) {
    throwApiError(response);
  }

  const data: ApiResponse<{ checkoutId: number }> = await response.json();
  const checkoutId = data.result.checkoutId;

  return checkoutId;
};

export const getCheckoutContent = async (
  checkoutId: number,
): Promise<CheckoutContent> => {
  const response = await fetch(`${BASE_URL}/checkout/${checkoutId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  const data: ApiResponse<CheckoutContent> = await response.json();
  const checkoutContent = data.result;

  return checkoutContent;
};

export const updateCheckoutApplyCoupon = async (
  checkoutId: number,
  nextCouponIds: number[],
): Promise<CheckoutApplyCouponResponse> => {
  const response = await fetch(`${BASE_URL}/checkout/${checkoutId}/coupons`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ couponIds: nextCouponIds }),
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  const data: ApiResponse<CheckoutApplyCouponResponse> = await response.json();
  const { appliedCouponIds, deliveryFee, couponDiscountPrice, totalPrice } =
    data.result;

  return { appliedCouponIds, deliveryFee, couponDiscountPrice, totalPrice };
};

export const updateCheckoutRemoteArea = async (
  checkoutId: number,
  nextRemoteArea: boolean,
): Promise<CheckoutRemoteAreaResponse> => {
  const response = await fetch(
    `${BASE_URL}/checkout/${checkoutId}/remote-area`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ remoteArea: nextRemoteArea }),
    },
  );

  if (!response.ok) {
    await throwApiError(response);
  }

  const data: ApiResponse<CheckoutRemoteAreaResponse> = await response.json();
  const { remoteArea, deliveryFee, couponDiscountPrice, totalPrice } =
    data.result;

  return { remoteArea, deliveryFee, couponDiscountPrice, totalPrice };
};

export const getCheckoutCoupons = async (
  checkoutId: number,
): Promise<CheckoutCouponResponse> => {
  const response = await fetch(`${BASE_URL}/checkout/${checkoutId}/coupons`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    await throwApiError(response);
  }

  const data: ApiResponse<CheckoutCouponResponse> = await response.json();
  const checkoutCouponResponse = data.result;

  return checkoutCouponResponse;
};

export const getCouponValidation = async (
  checkoutId: number,
): Promise<void> => {
  const response = await fetch(
    `${BASE_URL}/checkout/${checkoutId}/coupons/validation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    await throwApiError(response);
  }
};
