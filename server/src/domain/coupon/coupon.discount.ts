import type { CartItemResponse } from "../../interfaces/cart.interface.js";
import type { CouponEntity, CouponResponse, FixedCoupon, RateCoupon } from "../../interfaces/coupon.interface.js";
import { DEFAULT_SHIPPING_FEE, REMOTE_AREA_SHIPPING_FEE } from "../shipping/constants.js";

export function getDiscountType(coupon: CouponEntity): "FIXED" | "RATE" | "SHIPPING" {
  if (coupon.couponType === "RATE") return "RATE";
  if (coupon.couponType === "FREESHIPPING") return "SHIPPING";

  return "FIXED";
}

export function calculateTotalCouponDiscount(coupons: CouponResponse[], totalPrice: number) {
  const sortedCoupons = [...coupons].sort((a, b) => {
    if (a.discountType === "RATE") return 1;
    if (b.discountType === "RATE") return -1;
    return 0;
  });

  let calculatedDiscount = 0;
  let totalAmount = totalPrice;

  for (const coupon of sortedCoupons) {
    if (coupon.discountType === "FIXED") {
      const fixedDiscount = coupon.discountValue;
      calculatedDiscount += fixedDiscount;
      totalAmount -= fixedDiscount;
    }

    if (coupon.discountType === "SHIPPING") {
      const shippingDiscount = coupon.discountValue;
      calculatedDiscount += shippingDiscount;
    }

    if (coupon.discountType === "RATE") {
      const rateDiscount = Math.floor(totalAmount * (coupon.discountValue / 100));
      calculatedDiscount += rateDiscount;
      totalAmount -= rateDiscount;
    }
  }

  return calculatedDiscount;
}

export function calculateCouponDiscountValue(
  coupon: CouponEntity,
  selectedItems: CartItemResponse[],
  isRemoteArea: boolean,
) {
  switch (coupon.couponType) {
    case "FIXED":
      return calculateFixedDiscount(coupon);

    case "RATE":
      return calculateRateDiscount(coupon);

    case "BOGO":
      return calculateBogoDiscount(selectedItems);

    case "FREESHIPPING":
      return calculateFreeShippingDiscount(isRemoteArea);
  }
}

function calculateFixedDiscount(coupon: FixedCoupon) {
  return coupon.fixedAmount;
}

function calculateRateDiscount(coupon: RateCoupon) {
  return coupon.rateAmount;
}

function calculateBogoDiscount(selectedItems: CartItemResponse[]) {
  const eligibleItems = selectedItems.filter((item) => item.quantity >= 3);
  const mostExpensiveItem = eligibleItems.reduce((max, item) => {
    if (item.price > max.price) {
      return item;
    }

    return max;
  });

  return mostExpensiveItem.price;
}

function calculateFreeShippingDiscount(isRemoteArea: boolean) {
  if (isRemoteArea) return REMOTE_AREA_SHIPPING_FEE;

  return DEFAULT_SHIPPING_FEE;
}
