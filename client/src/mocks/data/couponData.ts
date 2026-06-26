import type { Coupon } from '../../apis/coupon';

export const maxCouponCount = 2;

export const couponIds = {
  fixedAmount: 'coupon-fixed-5000',
  buyOneGetOne: 'coupon-bogo',
  freeShipping: 'coupon-free-shipping',
  miracleSale: 'coupon-miracle-sale',
} as const;

export const coupons: Coupon[] = [
  {
    id: couponIds.fixedAmount,
    code: 'FIXED5000',
    name: '5,000원 할인 쿠폰',
    expiresAt: '2026-11-30T00:00:00.000Z',
    conditions: {
      minimumOrderAmount: 100_000,
    },
  },
  {
    id: couponIds.buyOneGetOne,
    code: 'BOGO',
    name: '2+1 쿠폰',
    expiresAt: '2026-06-30T00:00:00.000Z',
  },
  {
    id: couponIds.freeShipping,
    code: 'FREESHIPPING',
    name: '무료 배송 쿠폰',
    expiresAt: '2026-08-31T00:00:00.000Z',
    conditions: {
      minimumOrderAmount: 50_000,
    },
  },
  {
    id: couponIds.miracleSale,
    code: 'MIRACLESALE',
    name: '30% 시간제 할인 쿠폰',
    expiresAt: '2026-07-31T00:00:00.000Z',
    conditions: {
      availableTimeRange: {
        startsAt: '04:00',
        endsAt: '07:00',
      },
    },
  },
];
