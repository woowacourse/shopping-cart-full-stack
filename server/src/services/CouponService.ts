import {coupons} from '../repositories/index.js';
import {validateCoupon} from '../domain/couponPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {CouponResponse} from '../types/coupon.js';
import type {Preorder} from '../types/preorder.js';

const createCouponResponse = (coupon: Coupon, disabledReason: string | null): CouponResponse => {
  return {
    couponId: coupon.id,
    code: coupon.code,
    name: coupon.name,
    expirationDate: coupon.expirationDate.toISOString(),
    condition: coupon.condition,
    benefit: coupon.benefit,
    disabled: disabledReason !== null,
    disabledReason,
  };
};

export const couponService = {
  getCoupons(preorder: Preorder): CouponResponse[] {
    const couponResponses = coupons.findAll().map((coupon) => {
      const validationResult = validateCoupon(coupon, preorder);
      const disabledReason = validationResult.valid ? null : validationResult.reason;

      return createCouponResponse(coupon, disabledReason);
    });

    return couponResponses;
  },
};
