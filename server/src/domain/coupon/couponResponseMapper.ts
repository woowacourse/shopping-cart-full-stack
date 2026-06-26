import {getConditionDescription} from './couponConditionDescription.js';

import type {Coupon} from '../../models/Coupon.js';
import type {CouponResponse} from '../../types/coupon.js';

export const createCouponResponse = (coupon: Coupon, disabledReason: string | null): CouponResponse => {
  return {
    couponId: coupon.id,
    code: coupon.code,
    name: coupon.name,
    expirationDate: coupon.expirationDate.toISOString(),
    condition: {
      ...coupon.condition,
      description: getConditionDescription(coupon.condition),
    },
    benefit: coupon.benefit,
    disabled: disabledReason !== null,
    disabledReason,
  };
};
