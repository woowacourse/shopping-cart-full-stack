import { CartItemResponse } from "../../interfaces/cart.interface.js";
import { FREE_SHIPPING_THRESHOLD } from "../shipping/constants.js";
import {
  BogoCoupon,
  CouponEntity,
  FixedCoupon,
  FreeShippingCoupon,
  RateCoupon,
} from "../../interfaces/coupon.interface.js";

export function isCouponUsable(coupon: CouponEntity, selectedItems: CartItemResponse[]) {
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  switch (coupon.couponType) {
    case "FIXED":
      return isFixedCouponUsable(coupon, totalPrice);

    case "RATE":
      return isRateCouponUsable(coupon);

    case "BOGO":
      return isBogoCouponUsable(coupon, selectedItems);

    case "FREESHIPPING":
      return isFreeShippingCouponUsable(coupon, totalPrice);
  }
}

function isFixedCouponUsable(coupon: FixedCoupon, totalPrice: number) {
  if (coupon.isUsed) return false;
  if (coupon.expiredAt < new Date()) return false;
  if (totalPrice < coupon.minimumOrderPrice) return false;

  return true;
}

function isRateCouponUsable(coupon: RateCoupon) {
  if (coupon.isUsed) return false;
  if (coupon.expiredAt < new Date()) return false;

  const now = new Date().toTimeString().slice(0, 8);
  if (coupon.startedAt > now) return false;
  if (coupon.endedAt < now) return false;

  return true;
}

function isBogoCouponUsable(coupon: BogoCoupon, selectedItems: CartItemResponse[]) {
  if (coupon.isUsed) return false;
  if (coupon.expiredAt < new Date()) return false;

  const hasItemWithQuantityThree = selectedItems.some((item) => item.quantity >= 3);
  if (!hasItemWithQuantityThree) return false;

  return true;
}

function isFreeShippingCouponUsable(coupon: FreeShippingCoupon, totalPrice: number) {
  if (coupon.isUsed) return false;
  if (coupon.expiredAt < new Date()) return false;
  if (totalPrice < coupon.minimumOrderPrice) return false;
  if (totalPrice >= FREE_SHIPPING_THRESHOLD) return false;

  return true;
}
