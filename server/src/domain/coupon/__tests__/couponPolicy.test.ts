import {
  calculateProductCoupon,
  calculateShippingCouponDiscount,
  validateCoupon,
} from '../couponPolicy.js';
import {Coupon, type ProductDiscountCoupon} from '../../../models/Coupon.js';
import type {Preorder, PreorderItem} from '../../../types/preorder.js';

const preorderItems: PreorderItem[] = [
  {
    productId: 'product-1',
    name: '상품A',
    imageUrl: '/product-a.png',
    price: 100000,
    quantity: 1,
  },
];

const preorder: Preorder = {
  preorderId: 'preorder-1',
  items: preorderItems,
};

const createFixedDiscountCoupon = (discountAmount = 5000) =>
  new Coupon({
    id: 1,
    code: 'FIXED',
    name: '정액 할인 쿠폰',
    expirationDate: new Date('2026-12-31T23:59:59+09:00'),
    condition: {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 10000,
      },
    },
    benefit: {
      target: 'PRODUCT',
      discountType: 'FIXED',
      rule: 'DISCOUNT_AMOUNT',
      params: {
        discountAmount,
      },
    },
  });

const createHighestUnitPriceCoupon = () =>
  new Coupon({
    id: 2,
    code: 'BOGO',
    name: '2개 구매 시 1개 무료 쿠폰',
    expirationDate: new Date('2026-12-31T23:59:59+09:00'),
    condition: {
      target: 'PRODUCT',
      rule: 'MIN_SAME_PRODUCT_QUANTITY',
      params: {
        minSameProductQuantity: 2,
      },
    },
    benefit: {
      target: 'PRODUCT',
      discountType: 'FIXED',
      rule: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM',
      params: {
        discountQuantity: 1,
      },
    },
  });

const createRateDiscountCoupon = () =>
  new Coupon({
    id: 3,
    code: 'RATE',
    name: '30% 할인 쿠폰',
    expirationDate: new Date('2026-12-31T23:59:59+09:00'),
    condition: {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 10000,
      },
    },
    benefit: {
      target: 'PRODUCT',
      discountType: 'RATE',
      rule: 'DISCOUNT_RATE',
      params: {
        discountRate: 0.3,
        applyAfterFixedDiscount: true,
      },
    },
  });

const createTimeRangeDiscountCoupon = () =>
  new Coupon({
    id: 5,
    code: 'MIRACLESALE',
    name: '미라클모닝 30% 할인 쿠폰',
    expirationDate: new Date('2026-12-31T23:59:59+09:00'),
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
      discountType: 'RATE',
      rule: 'DISCOUNT_RATE',
      params: {
        discountRate: 0.3,
        applyAfterFixedDiscount: true,
      },
    },
  });

const createFreeShippingCoupon = () =>
  new Coupon({
    id: 4,
    code: 'FREESHIPPING',
    name: '무료 배송 쿠폰',
    expirationDate: new Date('2026-12-31T23:59:59+09:00'),
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
      params: {},
    },
  });

describe('couponPolicy.validateCoupon', () => {
  test('만료된 쿠폰이면 유효하지 않다', () => {
    const coupon = createFixedDiscountCoupon();

    expect(validateCoupon(coupon, preorder, {isRemoteArea: false, now: new Date('2027-01-01T00:00:00+09:00')})).toEqual({
      valid: false,
      reason: '만료된 쿠폰입니다.',
    });
  });

  test('최소 주문 금액 조건을 만족하지 못하면 유효하지 않다', () => {
    const coupon = createFixedDiscountCoupon();
    const lowPricePreorder = {
      ...preorder,
      items: [{...preorderItems[0], price: 1000}],
    };

    expect(validateCoupon(coupon, lowPricePreorder, {isRemoteArea: false})).toEqual({
      valid: false,
      reason: '주문 금액이 10,000원 미만입니다.',
    });
  });

  test.each([
    ['03:59', false],
    ['04:00', true],
    ['06:59', true],
    ['07:00', false],
  ])('시간제 쿠폰은 %s 기준으로 사용 가능 여부를 판단한다', (time, expectedValid) => {
    const coupon = createTimeRangeDiscountCoupon();

    expect(
      validateCoupon(coupon, preorder, {
        isRemoteArea: false,
        now: new Date(`2026-06-22T${time}:00+09:00`),
      }).valid
    ).toBe(expectedValid);
  });

  test('무료 배송 쿠폰은 배송비가 이미 0원이면 유효하지 않다', () => {
    const coupon = createFreeShippingCoupon();

    expect(validateCoupon(coupon, preorder, {isRemoteArea: false})).toEqual({
      valid: false,
      reason: '이미 무료 배송이 적용된 주문입니다.',
    });
  });

  test('무료 배송 쿠폰은 도서산간 배송비가 남아 있으면 유효하다', () => {
    const coupon = createFreeShippingCoupon();

    expect(validateCoupon(coupon, preorder, {isRemoteArea: true})).toEqual({
      valid: true,
    });
  });
});

describe('couponPolicy.calculateProductCoupon', () => {
  test('정액 할인 금액은 남은 상품 금액을 넘지 않는다', () => {
    const coupon = createFixedDiscountCoupon(10000);

    expect(calculateProductCoupon(coupon as ProductDiscountCoupon, preorderItems, 3000)).toEqual({
      discountAmount: 3000,
      benefitItem: null,
    });
  });

  test('동일 상품 수량 조건을 만족하는 상품 중 가장 비싼 상품 가격을 할인한다', () => {
    const coupon = createHighestUnitPriceCoupon();
    const items = [
      {...preorderItems[0], price: 10000, quantity: 2},
      {...preorderItems[0], productId: 'product-2', price: 30000, quantity: 2},
    ];

    expect(calculateProductCoupon(coupon as ProductDiscountCoupon, items, 100000)).toEqual({
      discountAmount: 30000,
      benefitItem: {
        productId: 'product-2',
        quantity: 1,
      },
    });
  });

  test('정율 할인 금액은 남은 상품 금액 기준으로 계산한다', () => {
    const coupon = createRateDiscountCoupon();

    expect(calculateProductCoupon(coupon as ProductDiscountCoupon, preorderItems, 90000)).toEqual({
      discountAmount: 27000,
      benefitItem: null,
    });
  });
});

describe('couponPolicy.calculateShippingCouponDiscount', () => {
  test('배송비 전체를 할인 금액으로 반환한다', () => {
    expect(calculateShippingCouponDiscount(3000)).toBe(3000);
  });
});
