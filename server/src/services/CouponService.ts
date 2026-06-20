import {HttpError} from '../middlewares/errorHandler.js';
import {coupons} from '../repositories/index.js';
import type {Coupon, CouponResponse} from '../types/coupon.js';

import {getCouponDisabledReason} from '../domain/couponPolicy.js';
import {preorderService} from './PreorderService.js';

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
  getCoupons(preorderId: unknown): CouponResponse[] {
    if (typeof preorderId !== 'string' || preorderId.trim().length === 0) {
      throw new HttpError(400, 'preorderId를 올바르게 입력해주세요.');
    }

    const preorder = preorderService.getPreorder(preorderId);

    return coupons.map((coupon) => {
      const disabledReason = getCouponDisabledReason(coupon, preorder);

      return createCouponResponse(coupon, disabledReason);
    });
  },
};
