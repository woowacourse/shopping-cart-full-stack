import {Coupon} from '../Coupon.js';

const createProductDiscountCoupon = (discountType: 'FIXED' | 'RATE' = 'FIXED') => {
  return new Coupon(
    1,
    'FIXED5000',
    '5000원 할인 쿠폰',
    new Date('2026-11-30T23:59:59+09:00'),
    {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 100000,
      },
    },
    {
      target: 'PRODUCT',
      discountType,
      rule: discountType === 'FIXED' ? 'DISCOUNT_AMOUNT' : 'DISCOUNT_RATE',
      params:
        discountType === 'FIXED'
          ? {
              discountAmount: 5000,
            }
          : {
              discountRate: 0.3,
              applyAfterFixedDiscount: true,
            },
    }
  );
};

const createShippingDiscountCoupon = () => {
  return new Coupon(
    2,
    'FREESHIPPING',
    '무료 배송 쿠폰',
    new Date('2026-08-31T23:59:59+09:00'),
    {
      target: 'ORDER',
      rule: 'MIN_ORDER_AMOUNT',
      params: {
        minOrderAmount: 50000,
      },
    },
    {
      target: 'SHIPPING',
      rule: 'FREE_SHIPPING',
      params: {},
    }
  );
};

describe('Coupon', () => {
  test('isExpired는 만료일이 현재 시각보다 이전이면 true를 반환한다', () => {
    const coupon = createProductDiscountCoupon();

    expect(coupon.isExpired(new Date('2026-12-01T00:00:00+09:00'))).toBe(true);
  });

  test('isExpired는 만료일이 현재 시각보다 이후이면 false를 반환한다', () => {
    const coupon = createProductDiscountCoupon();

    expect(coupon.isExpired(new Date('2026-11-30T00:00:00+09:00'))).toBe(false);
  });

  test('isProductDiscount는 상품 할인 쿠폰이면 true를 반환한다', () => {
    const coupon = createProductDiscountCoupon();

    expect(coupon.isProductDiscount()).toBe(true);
  });

  test('isShippingDiscount는 배송 할인 쿠폰이면 true를 반환한다', () => {
    const coupon = createShippingDiscountCoupon();

    expect(coupon.isShippingDiscount()).toBe(true);
  });

  test('getProductDiscountPriority는 정액 할인이 정율 할인보다 낮은 우선순위를 반환한다', () => {
    const fixedCoupon = createProductDiscountCoupon('FIXED');
    const rateCoupon = createProductDiscountCoupon('RATE');

    if (!fixedCoupon.isProductDiscount() || !rateCoupon.isProductDiscount()) {
      throw new Error('상품 할인 쿠폰 생성에 실패했습니다.');
    }

    expect(fixedCoupon.getProductDiscountPriority()).toBeLessThan(rateCoupon.getProductDiscountPriority());
  });
});
