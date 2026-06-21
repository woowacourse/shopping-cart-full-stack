import {calculateOrderAmount, calculateShippingFee} from './orderPolicy.js';

import type {Coupon, ProductDiscountCoupon} from '../models/Coupon.js';
import type {Preorder, PreorderItem} from '../types/preorder.js';

type ValidationResult = {valid: true} | {valid: false; reason: string};
type ValidateCouponOptions = {
  now?: Date;
  isRemoteArea?: boolean;
};

const COUPON_DISABLED_REASON = {
  expired: '만료된 쿠폰입니다.',
  freeShippingAlreadyApplied: '이미 무료 배송이 적용된 주문입니다.',
  minOrderAmount: (minAmount: number) => `주문 금액이 ${minAmount.toLocaleString('ko-KR')}원 미만입니다.`,
  minSameProductQuantity: (minQuantity: number) => `동일 상품을 ${minQuantity}개 이상 구매해야 합니다.`,
  timeRange: '현재 적용 가능한 시간이 아닙니다.',
} as const;

// utils
const getTimeRangeMinutes = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
};

const isInTimeRange = (time: Date, start: string, end: string) => {
  const currentMinutes = time.getHours() * 60 + time.getMinutes();
  const startMinutes = getTimeRangeMinutes(start);
  const endMinutes = getTimeRangeMinutes(end);

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

// logics
const validateMinOrderAmount = (preorder: Preorder, minOrderAmount: number): ValidationResult => {
  const orderAmount = calculateOrderAmount(preorder.items);

  if (orderAmount < minOrderAmount) {
    return {
      valid: false,
      reason: COUPON_DISABLED_REASON.minOrderAmount(minOrderAmount),
    };
  }

  return {valid: true};
};

const validateSameProductQuantity = (preorder: Preorder, minSameProductQuantity: number): ValidationResult => {
  const hasEnoughQuantity = preorder.items.some((item) => item.quantity >= minSameProductQuantity);

  if (!hasEnoughQuantity) {
    return {
      valid: false,
      reason: COUPON_DISABLED_REASON.minSameProductQuantity(minSameProductQuantity),
    };
  }

  return {valid: true};
};

const validateTimeRange = (time: Date, start: string, end: string): ValidationResult => {
  if (!isInTimeRange(time, start, end)) {
    return {
      valid: false,
      reason: COUPON_DISABLED_REASON.timeRange,
    };
  }

  return {valid: true};
};

const validateCouponCondition = (coupon: Coupon, preorder: Preorder, now: Date): ValidationResult => {
  const {condition} = coupon;

  switch (condition.rule) {
    case 'MIN_ORDER_AMOUNT':
      return validateMinOrderAmount(preorder, condition.params.minOrderAmount);
    case 'MIN_SAME_PRODUCT_QUANTITY':
      return validateSameProductQuantity(preorder, condition.params.minSameProductQuantity);
    case 'TIME_RANGE':
      return validateTimeRange(now, condition.params.start, condition.params.end);
  }
};

const validateCouponEffect = (coupon: Coupon, preorder: Preorder, isRemoteArea?: boolean): ValidationResult => {
  if (!coupon.isShippingDiscount() || isRemoteArea === undefined) {
    return {valid: true};
  }

  const orderAmount = calculateOrderAmount(preorder.items);
  const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);

  if (shippingFee === 0) {
    return {
      valid: false,
      reason: COUPON_DISABLED_REASON.freeShippingAlreadyApplied,
    };
  }

  return {valid: true};
};

const calculateHighestUnitPriceItemDiscount = (
  items: PreorderItem[],
  minSameProductQuantity: number,
  discountQuantity: number
) => {
  const targetItem = items
    .filter((item) => item.quantity >= minSameProductQuantity)
    .sort((a, b) => b.price - a.price)[0];

  if (!targetItem) {
    return 0;
  }

  return targetItem.price * discountQuantity;
};

// policies
export const validateCoupon = (
  coupon: Coupon,
  preorder: Preorder,
  options: ValidateCouponOptions = {}
): ValidationResult => {
  const now = options.now ?? new Date();

  if (coupon.isExpired(now)) {
    return {
      valid: false,
      reason: COUPON_DISABLED_REASON.expired,
    };
  }

  const conditionValidation = validateCouponCondition(coupon, preorder, now);

  if (!conditionValidation.valid) {
    return conditionValidation;
  }

  return validateCouponEffect(coupon, preorder, options.isRemoteArea);
};

export const calculateProductCouponDiscount = (
  coupon: ProductDiscountCoupon,
  items: PreorderItem[],
  remainingProductAmount: number
): number => {
  switch (coupon.benefit.rule) {
    case 'DISCOUNT_AMOUNT': {
      const discountAmount = coupon.benefit.params.discountAmount;

      if (discountAmount > remainingProductAmount) {
        return remainingProductAmount;
      }

      return discountAmount;
    }
    case 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM': {
      if (coupon.condition.rule !== 'MIN_SAME_PRODUCT_QUANTITY') {
        return 0;
      }

      const discountAmount = calculateHighestUnitPriceItemDiscount(
        items,
        coupon.condition.params.minSameProductQuantity,
        coupon.benefit.params.discountQuantity
      );

      if (discountAmount > remainingProductAmount) {
        return remainingProductAmount;
      }

      return discountAmount;
    }
    case 'DISCOUNT_RATE':
      return Math.floor(remainingProductAmount * coupon.benefit.params.discountRate);
  }
};

export const calculateShippingCouponDiscount = (shippingFee: number) => {
  return shippingFee;
};
