import { MAX_COUPON_COUNT } from '../constants/policy.js';
import BaseCoupon, { CouponContext } from '../models/coupons/Coupon.js';

export function findAvailableCoupons(
  context: CouponContext,
  coupons: BaseCoupon[],
) {
  return coupons.filter((coupon) => coupon.canApply(context));
}

export function findBestCouponCombination(
  context: CouponContext,
  coupons: BaseCoupon[],
) {
  const couponCombinations = createCouponCombinations(coupons);
  let bestCouponCombination: BaseCoupon[] = [];
  let bestDiscount = 0;

  couponCombinations.forEach((couponCombination) => {
    const discount = calculateCouponDiscount(context, couponCombination);

    if (discount > bestDiscount) {
      bestCouponCombination = couponCombination;
      bestDiscount = discount;
    }
  });

  return bestCouponCombination;
}

export function calculateCouponDiscount(
  context: CouponContext,
  coupons: BaseCoupon[],
) {
  const fixedDiscount = calculateFixedDiscount(context, coupons);
  const rateDiscount = calculateRateDiscount(context, coupons, fixedDiscount);

  return fixedDiscount + rateDiscount;
}

function createCouponCombinations(coupons: BaseCoupon[]) {
  const combinations: BaseCoupon[][] = [];

  coupons.forEach((coupon, index) => {
    combinations.push([coupon]);

    coupons.slice(index + 1).forEach((nextCoupon) => {
      combinations.push([coupon, nextCoupon]);
    });
  });

  return combinations.filter(
    (combination) => combination.length <= MAX_COUPON_COUNT,
  );
}

function calculateFixedDiscount(context: CouponContext, coupons: BaseCoupon[]) {
  return coupons
    .filter((coupon) => coupon.getDiscountType() === 'FIXED')
    .reduce((total, coupon) => total + coupon.calculateDiscount(context), 0);
}

function calculateRateDiscount(
  context: CouponContext,
  coupons: BaseCoupon[],
  fixedDiscount: number,
) {
  const rateCoupon = coupons.find(
    (coupon) => coupon.getDiscountType() === 'RATE',
  );

  if (!rateCoupon) {
    return 0;
  }

  const rateContext: CouponContext = {
    ...context,
    orderAmount: Math.max(context.orderAmount - fixedDiscount, 0),
  };

  return rateCoupon.calculateDiscount(rateContext);
}
