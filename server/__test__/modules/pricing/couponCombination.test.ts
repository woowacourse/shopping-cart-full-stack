import { OrderContext } from '../../../src/interfaces/couponPolicy.interface.js';
import { createCouponCombinations } from '../../../src/utils/couponCombination.js';
import { priceCalculator } from '../../../src/utils/priceCalculator.js';
import {
  createBogoCoupon,
  createCouponContext,
  createFixedAmountCoupon,
  createFreeShippingCoupon,
  createMiracleSaleCoupon,
} from '../../helpers/createCoupons.js';

describe('couponCombination', () => {
  test('쿠폰 목록으로 0개, 1개, 2개 쿠폰 조합을 만든다', () => {
    const coupons = [
      createFixedAmountCoupon(),
      createBogoCoupon(),
      createFreeShippingCoupon(),
      createMiracleSaleCoupon(),
    ];

    const combinations = createCouponCombinations(
      createCouponContext(),
      coupons,
    );

    expect(combinations).toEqual([
      [],
      [coupons[0]],
      [coupons[1]],
      [coupons[2]],
      [coupons[3]],
      [coupons[0], coupons[1]],
      [coupons[0], coupons[2]],
      [coupons[0], coupons[3]],
      [coupons[1], coupons[2]],
      [coupons[1], coupons[3]],
      [coupons[2], coupons[3]],
    ]);
  });

  test('최대 2개까지만 쿠폰 조합을 만든다', () => {
    const coupons = [
      createFixedAmountCoupon(),
      createBogoCoupon(),
      createFreeShippingCoupon(),
      createMiracleSaleCoupon(),
    ];

    const combinations = createCouponCombinations(
      createCouponContext(),
      coupons,
    );

    const hasMoreThanTwoCoupons = combinations.some(
      (combination) => combination.length > 2,
    );

    expect(hasMoreThanTwoCoupons).toBe(false);
  });

  test('쿠폰 목록에서 비활성화된 쿠폰은 제외하고 조합을 만든다', () => {
    const coupons = [
      createFixedAmountCoupon(), // 비활성화
      createBogoCoupon(),
      createFreeShippingCoupon(),
      createMiracleSaleCoupon(), // 비활성화
    ];

    const context: OrderContext = {
      orderProducts: [
        {
          productId: 'product-1',
          productName: '상품A',
          productPrice: 20000,
          quantity: 3,
        },
      ],
      isIsland: false,
      now: new Date('2026-06-14T10:00:00'),
    };

    const couponContext = priceCalculator.createCouponContext(context);

    const combinations = createCouponCombinations(couponContext, coupons);

    expect(combinations).toEqual([
      [],
      [coupons[1]],
      [coupons[2]],
      [coupons[1], coupons[2]],
    ]);
  });
});
