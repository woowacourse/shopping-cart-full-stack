import type {Coupon} from '../types/coupon.js';
import type {Preorder} from '../types/preorder.js';
import {calculateOrderAmount} from './orderPolicy.js';

const COUPON_DISABLED_REASON = {
  expired: '만료된 쿠폰입니다.',
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
const getMinOrderAmountReason = (preorder: Preorder, minOrderAmount: number) => {
  const orderAmount = calculateOrderAmount(preorder.items);

  if (orderAmount < minOrderAmount) {
    return COUPON_DISABLED_REASON.minOrderAmount(minOrderAmount);
  }

  return null;
};

const getSameProductQuantityReason = (preorder: Preorder, minSameProductQuantity: number) => {
  const hasEnoughQuantity = preorder.items.some((item) => item.quantity >= minSameProductQuantity);

  if (!hasEnoughQuantity) {
    return COUPON_DISABLED_REASON.minSameProductQuantity(minSameProductQuantity);
  }

  return null;
};

const getTimeRangeReason = (time: Date, start: string, end: string) => {
  if (!isInTimeRange(time, start, end)) {
    return COUPON_DISABLED_REASON.timeRange;
  }

  return null;
};

// policies
export const getCouponDisabledReason = (coupon: Coupon, preorder: Preorder, now = new Date()) => {
  const {condition, expirationDate} = coupon;

  if (expirationDate < now) {
    return COUPON_DISABLED_REASON.expired;
  }

  switch (condition.type) {
    case 'MIN_ORDER_AMOUNT':
      return getMinOrderAmountReason(preorder, condition.minOrderAmount);
    case 'MIN_SAME_PRODUCT_QUANTITY':
      return getSameProductQuantityReason(preorder, condition.minSameProductQuantity);
    case 'TIME_RANGE':
      return getTimeRangeReason(now, condition.start, condition.end);
  }
};

export const calculateCouponDiscount = (coupon: Coupon) => {
  switch (coupon.benefit.type) {
    case 'DISCOUNT_AMOUNT':
      return coupon.benefit.discountAmount;
    default:
      return 0;
  }
};
