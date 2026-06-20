import {calculateOrderAmount} from './orderPolicy.js';

import type {Coupon, ProductDiscountBenefit, ShippingDiscountBenefit} from '../types/coupon.js';
import type {Preorder, PreorderItem} from '../types/preorder.js';

type ProductDiscountCoupon = Coupon & {benefit: ProductDiscountBenefit};
type ShippingDiscountCoupon = Coupon & {benefit: ShippingDiscountBenefit};

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

export const isProductDiscountCoupon = (coupon: Coupon): coupon is ProductDiscountCoupon => {
  return coupon.benefit.target === 'PRODUCT';
};

export const isShippingDiscountCoupon = (coupon: Coupon): coupon is ShippingDiscountCoupon => {
  return coupon.benefit.target === 'SHIPPING';
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

const getHighestUnitPriceDiscount = (
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
export const getCouponDisabledReason = (coupon: Coupon, preorder: Preorder, now = new Date()) => {
  const {condition, expirationDate} = coupon;

  if (expirationDate < now) {
    return COUPON_DISABLED_REASON.expired;
  }

  switch (condition.rule) {
    case 'MIN_ORDER_AMOUNT':
      return getMinOrderAmountReason(preorder, condition.params.minOrderAmount);
    case 'MIN_SAME_PRODUCT_QUANTITY':
      return getSameProductQuantityReason(preorder, condition.params.minSameProductQuantity);
    case 'TIME_RANGE':
      return getTimeRangeReason(now, condition.params.start, condition.params.end);
  }
};

export const calculateProductCouponDiscount = (
  coupon: ProductDiscountCoupon,
  items: PreorderItem[],
  remainingProductAmount: number
) => {
  switch (coupon.benefit.rule) {
    case 'DISCOUNT_AMOUNT':
      return Math.min(coupon.benefit.params.discountAmount, remainingProductAmount);
    case 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM': {
      if (coupon.condition.rule !== 'MIN_SAME_PRODUCT_QUANTITY') {
        return 0;
      }

      return Math.min(
        getHighestUnitPriceDiscount(
          items,
          coupon.condition.params.minSameProductQuantity,
          coupon.benefit.params.discountQuantity
        ),
        remainingProductAmount
      );
    }
    case 'DISCOUNT_RATE':
      return Math.floor(remainingProductAmount * coupon.benefit.params.discountRate);
  }
};

export const getProductCouponPriority = (coupon: ProductDiscountCoupon) => {
  return coupon.benefit.rule === 'DISCOUNT_RATE' ? 1 : 0;
};
