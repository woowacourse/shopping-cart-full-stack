import {coupons} from '../repositories/index.js';
import {validateCoupon} from '../domain/couponPolicy.js';
import {calculateOrderAmount, calculateShippingFee} from '../domain/orderPolicy.js';
import {calculateBestOrderPricing} from '../domain/orderPricingPolicy.js';

import type {Coupon} from '../models/Coupon.js';
import type {CouponCondition, CouponResponse} from '../types/coupon.js';
import type {Preorder} from '../types/preorder.js';

const formatTime = (time: string) => {
  const [hour] = time.split(':').map(Number);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour <= 12 ? hour : hour - 12;

  return `${period} ${displayHour}시`;
};

const getConditionDescription = (condition: CouponCondition): string | null => {
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
      description: getConditionDescription(coupon.condition),
    },
    benefit: coupon.benefit,
    disabled: disabledReason !== null,
    disabledReason,
  };
};

export const couponService = {
  getCoupons(preorder: Preorder, isRemoteArea: boolean) {
    const applicableCoupons: Coupon[] = [];
    const couponResponses = coupons.findAll().map((coupon) => {
      const validationResult = validateCoupon(coupon, preorder, {isRemoteArea});
      const disabledReason = validationResult.valid ? null : validationResult.reason;

      if (validationResult.valid) {
        applicableCoupons.push(coupon);
      }

      return createCouponResponse(coupon, disabledReason);
    });
    const orderAmount = calculateOrderAmount(preorder.items);
    const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);
    const recommendedCouponIds = calculateBestOrderPricing(
      applicableCoupons,
      preorder.items,
      orderAmount,
      shippingFee
    ).appliedCoupons.map((coupon) => coupon.couponId);

    return {
      coupons: couponResponses,
      recommendedCouponIds,
    };
  },
};
