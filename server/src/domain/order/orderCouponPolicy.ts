import {validateCoupon} from '../coupon/couponPolicy.js';
import {coupons} from '../../repositories/index.js';

import type {Coupon} from '../../models/Coupon.js';
import type {ExcludedCoupon} from '../../types/order.js';
import type {PreorderItem} from '../../types/preorder.js';

const toExcludedCoupon = (couponId: number, excludedReason: string, coupon?: Coupon): ExcludedCoupon => {
  return {
    couponId,
    code: coupon?.code ?? '',
    name: coupon?.name ?? '',
    excludedReason,
  };
};

export const getPreviewCoupons = (
  couponIds: number[],
  preorderId: string,
  items: PreorderItem[],
  isRemoteArea: boolean
) => {
  const applicableCoupons: Coupon[] = [];
  const excludedCoupons: ExcludedCoupon[] = [];

  couponIds.forEach((couponId) => {
    const coupon = coupons.findById(couponId);

    if (!coupon) {
      excludedCoupons.push(toExcludedCoupon(couponId, '존재하지 않는 쿠폰입니다.'));
      return;
    }

    const validationResult = validateCoupon(coupon, {preorderId, items}, {isRemoteArea});

    if (!validationResult.valid) {
      excludedCoupons.push(toExcludedCoupon(coupon.id, validationResult.reason, coupon));
      return;
    }

    applicableCoupons.push(coupon);
  });

  return {applicableCoupons, excludedCoupons};
};
