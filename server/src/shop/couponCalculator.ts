import type TempOrder from "./models/TempOrder.js";
import { Coupon, CouponPhase } from "./models/Coupon.js";
import { combinations } from "../utils.js";
import { COUPON_SELECT_LIMIT } from "./constants.js";

export function calculateDiscount(order: TempOrder, coupons: Coupon[]): number {
  const sorted = [...coupons].sort((a, b) => a.phase - b.phase);
  const orderPrice = order.calculateOrderPrice();
  let fixedDiscount = 0;
  for (const coupon of sorted) {
    if (coupon.phase === CouponPhase.FIXED)
      fixedDiscount += coupon.getDiscountPrice(order);
  }
  let rateDiscount = 0;
  for (const coupon of sorted) {
    if (coupon.phase === CouponPhase.RATE)
      rateDiscount += coupon.getDiscountPrice(
        order,
        orderPrice - fixedDiscount,
      );
  }
  return Math.min(orderPrice, fixedDiscount + rateDiscount);
}

export function findBestCouponCombination(
  order: TempOrder,
  coupons: Coupon[],
): Coupon[] {
  const couponCombinations = combinations(coupons, COUPON_SELECT_LIMIT);
  let bestDiscount = 0;
  let bestCombination: Coupon[] = [];
  for (const combination of couponCombinations) {
    const discount = calculateDiscount(order, combination);
    if (discount > bestDiscount) {
      bestDiscount = discount;
      bestCombination = combination;
    }
  }
  return bestCombination;
}
