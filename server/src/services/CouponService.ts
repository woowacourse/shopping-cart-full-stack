import {coupons} from '../repositories/index.js';
import {validateCoupon} from '../domain/couponPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {CouponConditionResponse, CouponResponse} from '../types/coupon.js';
import type {Preorder} from '../types/preorder.js';

const formatTime = (time: string) => {
  const [hour] = time.split(':').map(Number);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour <= 12 ? hour : hour - 12;

  return `${period} ${displayHour}시`;
};

const getConditionDescription = (coupon: Coupon): string | null => {
  const {condition} = coupon;

  switch (condition.rule) {
    case 'MIN_ORDER_AMOUNT':
      return `최소 주문 금액: ${condition.params.minOrderAmount.toLocaleString('ko-KR')}원`;
    case 'MIN_SAME_PRODUCT_QUANTITY':
      return null;
    case 'TIME_RANGE':
      return `사용 가능 시간: ${formatTime(condition.params.start)}부터 ${formatTime(condition.params.end)}까지`;
  }
};

const createCouponResponse = (coupon: Coupon, disabledReason: string | null): CouponResponse => {
  return {
    couponId: coupon.id,
    code: coupon.code,
    name: coupon.name,
    expirationDate: coupon.expirationDate.toISOString(),
    condition: {
      ...coupon.condition,
      description: getConditionDescription(coupon),
    },
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
