import { CouponResponse } from "../../interfaces/coupon.interface.js";

export function createCouponCombinations(usableCoupons: CouponResponse[]): CouponResponse[][] {
  if (usableCoupons.length === 0) {
    return [];
  }

  if (usableCoupons.length === 1) {
    return [[usableCoupons[0]]];
  }

  const combinations: CouponResponse[][] = [];

  for (let i = 0; i < usableCoupons.length; i++) {
    for (let j = i + 1; j < usableCoupons.length; j++) {
      combinations.push([usableCoupons[i], usableCoupons[j]]);
    }
  }

  return combinations;
}

export function findBestCombination(combinationResults: { couponIds: number[]; discountAmount: number }[]) {
  if (combinationResults.length === 0) {
    return [];
  }

  const bestCombination = combinationResults.reduce((max, current) =>
    current.discountAmount > max.discountAmount ? current : max,
  );

  return bestCombination.couponIds;
}
