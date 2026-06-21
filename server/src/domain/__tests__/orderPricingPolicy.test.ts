import {calculateBestOrderPricing, calculateOrderPricing} from '../orderPricingPolicy.js';
import {Coupon} from '../../models/Coupon.js';
import type {PreorderItem} from '../../types/preorder.js';

const items: PreorderItem[] = [
  {
    productId: 'product-1',
    name: '상품A',
    imageUrl: '/product-a.png',
    price: 70000,
    quantity: 1,
  },
];

const createFixedDiscountCoupon = () =>
  new Coupon(
    1,
    'FIXED5000',
    '5000원 할인 쿠폰',
    new Date('2026-12-31T23:59:59+09:00'),
    {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 10000,
      },
    },
    {
      target: 'PRODUCT',
      discountType: 'FIXED',
      rule: 'DISCOUNT_AMOUNT',
      params: {
        discountAmount: 5000,
      },
    }
  );

const createRateDiscountCoupon = () =>
  new Coupon(
    2,
    'RATE30',
    '30% 할인 쿠폰',
    new Date('2026-12-31T23:59:59+09:00'),
    {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 10000,
      },
    },
    {
      target: 'PRODUCT',
      discountType: 'RATE',
      rule: 'DISCOUNT_RATE',
      params: {
        discountRate: 0.3,
        applyAfterFixedDiscount: true,
      },
    }
  );

const createFreeShippingCoupon = () =>
  new Coupon(
    3,
    'FREESHIPPING',
    '무료 배송 쿠폰',
    new Date('2026-12-31T23:59:59+09:00'),
    {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 10000,
      },
    },
    {
      target: 'SHIPPING',
      rule: 'FREE_SHIPPING',
      params: {},
    }
  );

const createBogoCoupon = () =>
  new Coupon(
    4,
    'BOGO',
    '2개 구매 시 1개 무료 쿠폰',
    new Date('2026-12-31T23:59:59+09:00'),
    {
      target: 'PRODUCT',
      rule: 'MIN_SAME_PRODUCT_QUANTITY',
      params: {
        minSameProductQuantity: 2,
      },
    },
    {
      target: 'PRODUCT',
      discountType: 'FIXED',
      rule: 'DISCOUNT_HIGHEST_UNIT_PRICE_ITEM',
      params: {
        discountQuantity: 1,
      },
    }
  );

describe('orderPricingPolicy.calculateOrderPricing', () => {
  test('상품 할인과 배송비 할인을 결제 금액에 반영한다', () => {
    const result = calculateOrderPricing([createFixedDiscountCoupon(), createFreeShippingCoupon()], items, 70000, 3000);

    expect(result).toEqual({
      price: {
        orderAmount: 70000,
        productDiscountAmount: 5000,
        shippingDiscountAmount: 3000,
        totalDiscountAmount: 8000,
        shippingFee: 0,
        totalPaymentAmount: 65000,
      },
      appliedCoupons: [
        {
          couponId: 1,
          code: 'FIXED5000',
          name: '5000원 할인 쿠폰',
          discountAmount: 5000,
        },
        {
          couponId: 3,
          code: 'FREESHIPPING',
          name: '무료 배송 쿠폰',
          discountAmount: 3000,
        },
      ],
      benefitItems: [],
    });
  });

  test('2+1 쿠폰은 무료 증정 상품 정보를 함께 반환한다', () => {
    const result = calculateOrderPricing([createBogoCoupon()], [{...items[0], quantity: 2}], 140000, 0);

    expect(result.price).toEqual({
      orderAmount: 210000,
      productDiscountAmount: 70000,
      shippingDiscountAmount: 0,
      totalDiscountAmount: 70000,
      shippingFee: 0,
      totalPaymentAmount: 140000,
    });
    expect(result.benefitItems).toEqual([
      {
        productId: 'product-1',
        quantity: 1,
      },
    ]);
  });
});

describe('orderPricingPolicy.calculateBestOrderPricing', () => {
  test('쿠폰 조합 중 총 결제 금액이 가장 낮은 조합을 선택한다', () => {
    const result = calculateBestOrderPricing(
      [createFixedDiscountCoupon(), createRateDiscountCoupon(), createFreeShippingCoupon()],
      items,
      70000,
      3000
    );

    expect(result.price).toEqual({
      orderAmount: 70000,
      productDiscountAmount: 24500,
      shippingDiscountAmount: 0,
      totalDiscountAmount: 24500,
      shippingFee: 3000,
      totalPaymentAmount: 48500,
    });
    expect(result.appliedCoupons.map((coupon) => coupon.couponId)).toEqual([1, 2]);
    expect(result.benefitItems).toEqual([]);
  });
});
