import OrderSheet from '../models/OrderSheet.js';
import BuyNGetMCoupon from '../models/coupons/BuyNGetMCoupon.js';
import FixedAmountCoupon from '../models/coupons/FixedAmountCoupon.js';
import FreeShippingCoupon from '../models/coupons/FreeShippingCoupon.js';
import { CouponContext } from '../models/coupons/Coupon.js';
import RateCoupon from '../models/coupons/RateCoupon.js';

const orderSheet = new OrderSheet('user-1', [
  {
    product: {
      id: 'product-1',
      name: '피자',
      price: 30000,
      thumbnail: 'pizza.png',
    },
    quantity: 2,
  },
]);

const createTestCouponContext = (
  overrides: Partial<CouponContext> = {},
): CouponContext => ({
  orderSheet,
  orderAmount: 60000,
  shippingFee: 3000,
  now: new Date('2026-06-19T00:00:00.000Z'),
  ...overrides,
});

describe('FixedAmountCoupon tests', () => {
  test('최소 주문 금액을 만족하면 쿠폰을 사용할 수 있다.', () => {
    const coupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
      conditions: {
        minimumOrderAmount: 50000,
      },
    });

    expect(coupon.canApply(createTestCouponContext())).toBe(true);
  });

  test('최소 주문 금액을 만족하지 않으면 쿠폰을 사용할 수 없다.', () => {
    const coupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
      conditions: {
        minimumOrderAmount: 100000,
      },
    });

    expect(coupon.canApply(createTestCouponContext())).toBe(false);
  });

  test('만료된 쿠폰은 사용할 수 없다.', () => {
    const coupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-01-01'),
    });

    expect(coupon.canApply(createTestCouponContext())).toBe(false);
  });

  test('사용 가능한 경우 설정한 금액만큼 할인한다.', () => {
    const coupon = new FixedAmountCoupon({
      code: 'FIXED5000',
      name: '5,000원 할인 쿠폰',
      amount: 5000,
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.calculateDiscount(createTestCouponContext())).toBe(5000);
  });
});

describe('RateCoupon tests', () => {
  test('사용 가능한 경우 주문 금액에서 설정한 비율만큼 할인한다.', () => {
    const coupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.calculateDiscount(createTestCouponContext())).toBe(18000);
  });

  test('사용할 수 없는 경우 할인하지 않는다.', () => {
    const coupon = new RateCoupon({
      code: 'MIRACLESALE',
      name: '30% 할인 쿠폰',
      rate: 30,
      expiresAt: new Date('2026-12-31'),
      conditions: {
        minimumOrderAmount: 100000,
      },
    });

    expect(coupon.calculateDiscount(createTestCouponContext())).toBe(0);
  });
});

describe('FreeShippingCoupon tests', () => {
  test('배송비가 있으면 쿠폰을 사용할 수 있다.', () => {
    const coupon = new FreeShippingCoupon({
      code: 'FREESHIPPING',
      name: '무료 배송 쿠폰',
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.canApply(createTestCouponContext())).toBe(true);
  });

  test('배송비만큼 할인한다.', () => {
    const coupon = new FreeShippingCoupon({
      code: 'FREESHIPPING',
      name: '무료 배송 쿠폰',
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.calculateDiscount(createTestCouponContext())).toBe(3000);
  });

  test('배송비가 없으면 쿠폰을 사용할 수 없다.', () => {
    const coupon = new FreeShippingCoupon({
      code: 'FREESHIPPING',
      name: '무료 배송 쿠폰',
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.canApply(createTestCouponContext({ shippingFee: 0 }))).toBe(
      false,
    );
  });
});

describe('BuyNGetMCoupon tests', () => {
  const buyNGetMOrderSheet = new OrderSheet('user-1', [
    {
      product: {
        id: 'product-1',
        name: '피자',
        price: 30000,
        thumbnail: 'pizza.png',
      },
      quantity: 3,
    },
    {
      product: {
        id: 'product-2',
        name: '치킨',
        price: 20000,
        thumbnail: 'chicken.png',
      },
      quantity: 4,
    },
  ]);

  const createBuyNGetMCouponContext = (
    overrides: Partial<CouponContext> = {},
  ): CouponContext =>
    createTestCouponContext({
      orderSheet: buyNGetMOrderSheet,
      orderAmount: 170000,
      ...overrides,
    });

  test('필요한 수량을 만족하면 쿠폰을 사용할 수 있다.', () => {
    const coupon = new BuyNGetMCoupon({
      code: 'BOGO',
      name: '2+1 쿠폰',
      buyQuantity: 2,
      freeQuantity: 1,
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.canApply(createBuyNGetMCouponContext())).toBe(true);
  });

  test('필요한 수량을 만족하지 않으면 쿠폰을 사용할 수 없다.', () => {
    const coupon = new BuyNGetMCoupon({
      code: 'BOGO',
      name: '2+1 쿠폰',
      buyQuantity: 4,
      freeQuantity: 1,
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.canApply(createBuyNGetMCouponContext())).toBe(false);
  });

  test('대상 상품 중 가장 비싼 상품 가격만큼 할인한다.', () => {
    const coupon = new BuyNGetMCoupon({
      code: 'BOGO',
      name: '2+1 쿠폰',
      buyQuantity: 2,
      freeQuantity: 1,
      expiresAt: new Date('2026-12-31'),
    });

    expect(coupon.calculateDiscount(createBuyNGetMCouponContext())).toBe(30000);
  });
});
