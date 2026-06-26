import OrderSheet from '../models/OrderSheet.js';
import FixedAmountCoupon from '../models/coupons/FixedAmountCoupon.js';
import RateCoupon from '../models/coupons/RateCoupon.js';
import {
  calculateCouponDiscount,
  findAvailableCoupons,
  findBestCouponCombination,
} from '../services/couponDiscount.js';
import { createPricingContext } from '../services/orderSheetPricing.js';

const orderSheet = new OrderSheet('user-1', [
  {
    product: {
      id: 'product-1',
      name: '피자',
      price: 100000,
      thumbnail: 'pizza.png',
    },
    quantity: 1,
  },
]);

describe('couponDiscount tests', () => {
  test('정액 쿠폰을 먼저 적용하고 할인된 주문 금액에서 정률 쿠폰을 적용한다.', () => {
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });

    const discount = calculateCouponDiscount(createPricingContext(orderSheet), [
      fixedAmountCoupon,
      rateCoupon,
    ]);

    expect(discount).toBe(33500);
  });

  test('최대 2개 쿠폰 조합 중 할인 금액이 가장 큰 조합을 찾는다.', () => {
    const fixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
    });
    const smallFixedAmountCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '1,000원 할인 쿠폰',
      amount: 1000,
      expiresAt: new Date('2026-12-31'),
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });

    const bestCoupons = findBestCouponCombination(
      createPricingContext(orderSheet),
      [fixedAmountCoupon, smallFixedAmountCoupon, rateCoupon],
    );

    expect(bestCoupons).toEqual([fixedAmountCoupon, rateCoupon]);
  });

  test('사용할 수 없는 쿠폰은 조합 계산에서 제외한다.', () => {
    const unavailableCoupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-01-01'),
    });
    const rateCoupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });

    const context = createPricingContext(orderSheet);
    const availableCoupons = findAvailableCoupons(context, [
      unavailableCoupon,
      rateCoupon,
    ]);
    const bestCoupons = findBestCouponCombination(context, availableCoupons);

    expect(bestCoupons).toEqual([rateCoupon]);
  });
});
