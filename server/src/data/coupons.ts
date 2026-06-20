import type {Coupon} from '../types/coupon.js';

export const couponData: Coupon[] = [
  {
    id: 1,
    code: 'FIXED5000',
    name: '5000원 할인 쿠폰',
    expirationDate: new Date('2026-11-30T23:59:59+09:00'),
    condition: {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 100000,
      },
    },
    benefit: {
      target: 'PRODUCT',
      rule: 'DISCOUNT_AMOUNT',
      params: {
        discountAmount: 5000,
      },
    },
  },
  {
    id: 2,
    code: 'BOGO',
    name: '2+1 쿠폰',
    expirationDate: new Date('2026-06-30T23:59:59+09:00'),
    condition: {
      target: 'PRODUCT',
      rule: 'MIN_SAME_PRODUCT_QUANTITY',
      params: {
        minSameProductQuantity: 2,
      },
    },
    benefit: {
      target: 'PRODUCT',
      rule: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM',
      params: {
        discountQuantity: 1,
      },
    },
  },
  {
    id: 3,
    code: 'FREESHIPPING',
    name: '무료 배송 쿠폰',
    expirationDate: new Date('2026-08-31T23:59:59+09:00'),
    condition: {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 50000,
      },
    },
    benefit: {
      target: 'SHIPPING',
      rule: 'FREE_SHIPPING',
      params: {
        includesRemoteAreaFee: true,
      },
    },
  },
  {
    id: 4,
    code: 'MIRACLESALE',
    name: '30% 시간제 할인 쿠폰',
    expirationDate: new Date('2026-07-31T23:59:59+09:00'),
    condition: {
      target: 'TIME',
      rule: 'TIME_RANGE',
      params: {
        start: '04:00',
        end: '07:00',
      },
    },
    benefit: {
      target: 'PRODUCT',
      rule: 'DISCOUNT_RATE',
      params: {
        discountRate: 0.3,
        applyAfterFixedDiscount: true,
      },
    },
  },
];
