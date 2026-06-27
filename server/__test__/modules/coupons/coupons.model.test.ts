import {
  createFixedAmountCoupon,
  createBogoCoupon,
  createFreeShippingCoupon,
  createMiracleSaleCoupon,
  createCouponContext,
} from '../../helpers/createCoupons.js';

describe('쿠폰 공통 정책', () => {
  test('만료일이 지난 쿠폰은 적용할 수 없다', () => {
    const coupon = createFixedAmountCoupon(new Date('2026-06-13'));

    const isApplicable = coupon.isApplicable(
      createCouponContext({ now: new Date('2026-06-14T00:00:00') }),
    );

    expect(isApplicable).toBe(false);
  });

  test('만료일 당일에는 적용할 수 있다', () => {
    const coupon = createFixedAmountCoupon(new Date('2026-06-14T23:59:59'));

    const isApplicable = coupon.isApplicable(
      createCouponContext({ now: new Date('2026-06-14T23:59:59') }),
    );

    expect(isApplicable).toBe(true);
  });
});

describe('FIXED5000 쿠폰', () => {
  test('주문 금액이 100,000원 이상일 때 5,000원을 할인한다', () => {
    const coupon = createFixedAmountCoupon();

    const discount = coupon.calculateDiscount(
      createCouponContext({ orderPrice: 100000 }),
    );

    expect(discount).toEqual({
      productDiscountPrice: 5000,
      deliveryDiscountPrice: 0,
    });
  });

  test('주문 금액이 100,000원 이상이면 적용할 수 있다', () => {
    const coupon = createFixedAmountCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({ orderPrice: 100000 }),
    );

    expect(isApplicable).toBe(true);
  });

  test('주문 금액이 100,000원 미만이면 적용할 수 없다', () => {
    const coupon = createFixedAmountCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 99999,
            quantity: 1,
          },
        ],
      }),
    );

    expect(isApplicable).toBe(false);
  });
});

describe('BOGO 쿠폰', () => {
  test('동일 상품 3개 구매 시 단가가 가장 높은 상품 1개 가격을 할인한다', () => {
    const coupon = createBogoCoupon();
    const context = createCouponContext({
      orderProducts: [
        {
          productId: 'product-1',
          productName: '상품A',
          productPrice: 10000,
          quantity: 3,
        },
        {
          productId: 'product-2',
          productName: '상품B',
          productPrice: 30000,
          quantity: 1,
        },
      ],
      orderPrice: 60000,
    });

    const discount = coupon.calculateDiscount(context);

    expect(discount).toEqual({
      productDiscountPrice: 10000,
      deliveryDiscountPrice: 0,
    });
  });

  test('동일 상품을 3개 이상 구매한 상품이 여러 개면 단가가 가장 높은 상품을 기준으로 할인한다', () => {
    const coupon = createBogoCoupon();
    const context = createCouponContext({
      orderProducts: [
        {
          productId: 'product-1',
          productName: '상품A',
          productPrice: 10000,
          quantity: 3,
        },
        {
          productId: 'product-2',
          productName: '상품B',
          productPrice: 30000,
          quantity: 3,
        },
      ],
      orderPrice: 120000,
    });

    const discount = coupon.calculateDiscount(context);

    expect(discount).toEqual({
      productDiscountPrice: 30000,
      deliveryDiscountPrice: 0,
    });
  });

  test('동일 상품 수량이 3개 미만이면 적용할 수 없다', () => {
    const coupon = createBogoCoupon();
    const context = createCouponContext({
      orderProducts: [
        {
          productId: 'product-1',
          productName: '상품A',
          productPrice: 10000,
          quantity: 2,
        },
        {
          productId: 'product-2',
          productName: '상품B',
          productPrice: 30000,
          quantity: 1,
        },
      ],
    });

    const isApplicable = coupon.isApplicable(context);

    expect(isApplicable).toBe(false);
  });
});

describe('FREESHIPPING 쿠폰', () => {
  test('배송비를 0원으로 처리한다', () => {
    const coupon = createFreeShippingCoupon();

    const discount = coupon.calculateDiscount(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 99999,
            quantity: 1,
          },
        ],
      }),
    );

    expect(discount).toEqual({
      productDiscountPrice: 0,
      deliveryDiscountPrice: 3000,
    });
  });

  test('도서산간 추가 배송비까지 무료 처리한다', () => {
    const coupon = createFreeShippingCoupon();

    const discount = coupon.calculateDiscount(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 50000,
            quantity: 1,
          },
        ],
        isIsland: true,
      }),
    );

    expect(discount).toEqual({
      productDiscountPrice: 0,
      deliveryDiscountPrice: 6000,
    });
  });

  test('상품 할인 금액은 발생시키지 않는다', () => {
    const coupon = createFreeShippingCoupon();

    const discount = coupon.calculateDiscount(
      createCouponContext({
        orderPrice: 50000,
        deliveryFee: 3000,
      }),
    );

    expect(discount.productDiscountPrice).toBe(0);
  });

  test('주문 금액이 50,000원 이상이면 적용할 수 있다', () => {
    const coupon = createFreeShippingCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 50000,
            quantity: 1,
          },
        ],
      }),
    );

    expect(isApplicable).toBe(true);
  });

  test('주문 금액이 50,000원 미만이면 적용할 수 없다', () => {
    const coupon = createFreeShippingCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 49999,
            quantity: 1,
          },
        ],
      }),
    );

    expect(isApplicable).toBe(false);
  });
});

describe('MIRACLESALE 쿠폰', () => {
  test('오전 4시부터 7시 사이에 30% 할인한다', () => {
    const coupon = createMiracleSaleCoupon();

    const discount = coupon.calculateDiscount(
      createCouponContext({
        orderProducts: [
          {
            productId: 'product-1',
            productName: '상품A',
            productPrice: 100000,
            quantity: 1,
          },
        ],
        now: new Date('2026-06-14T05:00:00'),
      }),
    );

    expect(discount).toEqual({
      productDiscountPrice: 30000,
      deliveryDiscountPrice: 0,
    });
  });

  test('오전 4시 정각에는 적용할 수 있다', () => {
    const coupon = createMiracleSaleCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({ now: new Date('2026-06-14T04:00:00') }),
    );

    expect(isApplicable).toBe(true);
  });

  test('오전 7시 정각에는 적용할 수 없다', () => {
    const coupon = createMiracleSaleCoupon();

    const isApplicable = coupon.isApplicable(
      createCouponContext({ now: new Date('2026-06-14T07:00:00') }),
    );

    expect(isApplicable).toBe(false);
  });
});
