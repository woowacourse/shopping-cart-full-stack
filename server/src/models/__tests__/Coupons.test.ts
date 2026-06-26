import {Coupon} from '../Coupon.js';
import {Coupons} from '../Coupons.js';

const createCoupon = (id: number) => {
  return new Coupon({
    id,
    code: `COUPON${id}`,
    name: `쿠폰${id}`,
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
      discountType: 'FIXED',
      rule: 'DISCOUNT_AMOUNT',
      params: {
        discountAmount: 5000,
      },
    },
  });
};

const createCoupons = () => {
  return new Coupons([createCoupon(1), createCoupon(2)]);
};

describe('Coupons', () => {
  test('findAll은 쿠폰 목록 복사본을 반환한다', () => {
    const coupons = createCoupons();

    expect(coupons.findAll()).toHaveLength(2);
    expect(coupons.findAll()).not.toBe(coupons.findAll());
  });

  test('findById는 id에 해당하는 쿠폰을 반환한다', () => {
    const coupons = createCoupons();

    expect(coupons.findById(1)?.id).toBe(1);
  });

  test('findById는 없는 id이면 undefined를 반환한다', () => {
    const coupons = createCoupons();

    expect(coupons.findById(999)).toBeUndefined();
  });
});
