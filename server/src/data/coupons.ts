import type {Coupon} from '../types/coupon.js';

export const couponData: Coupon[] = [
  {
    id: 1,
    code: 'FIXED5000',
    name: '5000원 할인 쿠폰',
    expirationDate: new Date('2026-11-30T23:59:59+09:00'),
    condition: {
      type: 'MIN_ORDER_AMOUNT',
      minOrderAmount: 100000,
    },
    benefit: {
      type: 'DISCOUNT_AMOUNT',
      discountAmount: 5000,
    },
  },
  {
    id: 2,
    code: 'BOGO',
    name: '2+1 쿠폰',
    expirationDate: new Date('2026-06-30T23:59:59+09:00'),
    condition: {
      type: 'MIN_SAME_PRODUCT_QUANTITY',
      minSameProductQuantity: 2,
    },
    benefit: {
      type: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM',
      discountQuantity: 1,
    },
  },
  {
    id: 3,
    code: 'FREESHIPPING',
    name: '무료 배송 쿠폰',
    expirationDate: new Date('2026-08-31T23:59:59+09:00'),
    condition: {
      type: 'MIN_ORDER_AMOUNT',
      minOrderAmount: 50000,
    },
    benefit: {
      type: 'FREE_SHIPPING',
      includesRemoteAreaFee: true,
    },
  },
  {
    id: 4,
    code: 'MIRACLESALE',
    name: '30% 시간제 할인 쿠폰',
    expirationDate: new Date('2026-07-31T23:59:59+09:00'),
    condition: {
      type: 'TIME_RANGE',
      start: '04:00',
      end: '07:00',
    },
    benefit: {
      type: 'DISCOUNT_RATE',
      discountRate: 0.3,
      applyAfterFixedDiscount: true,
    },
  },
];
