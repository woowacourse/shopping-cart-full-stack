import { describe, expect, test } from '@jest/globals';
import { calculateBestCouponDiscount } from '../../src/domain/couponCalculator';
import type {
  BogoCoupon,
  Coupon,
  FixedAmountCoupon,
  FreeShippingCoupon,
  OrderData,
  OrderProduct,
  PercentageCoupon,
} from '../../src/types/type';

const fixed5000Coupon: FixedAmountCoupon = {
  code: 'FIXED5000',
  name: '5,000원 할인 쿠폰',
  expiresAt: '2026-11-30',
  minOrderAmount: 100000,
  discountAmount: 5000,
};

const bogoCoupon: BogoCoupon = {
  code: 'BOGO',
  name: '2개 구매 시 1개 무료 쿠폰',
  expiresAt: '2026-06-30',
  minCount: 3,
  freeCount: 1,
};

const freeShippingCoupon: FreeShippingCoupon = {
  code: 'FREESHIPPING',
  name: '5만원 이상 구매 시 무료 배송 쿠폰',
  expiresAt: '2026-08-31',
  minOrderAmount: 50000,
  discountAmount: 3000,
  remoteAreaFee: 3000,
};

const percentageCoupon: PercentageCoupon = {
  code: 'MIRACLESALE',
  name: '미라클모닝 30% 할인 쿠폰',
  expiresAt: '2026-07-31',
  discountRate: 30,
  startTime: '04:00',
  endTime: '07:00',
};

const coupons: Coupon[] = [
  fixed5000Coupon,
  bogoCoupon,
  freeShippingCoupon,
  percentageCoupon,
];

const createDateAt = (time: string) => {
  return new Date(`2026-06-17T${time}:00`);
};

const calculateShippingFee = (orderAmount: number, isRemoteArea: boolean) => {
  const baseShippingFee = orderAmount >= 100000 ? 0 : 3000;

  return baseShippingFee + (isRemoteArea ? 3000 : 0);
};

const createOrder = (
  products: OrderProduct[],
  isRemoteArea = false,
): OrderData => {
  const orderAmount = products.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
  const shippingFee = calculateShippingFee(orderAmount, isRemoteArea);

  return {
    id: 'order-id',
    products,
    isRemoteArea,
    amount: {
      orderAmount,
      discountAmount: 0,
      shippingFee,
      totalAmount: orderAmount + shippingFee,
    },
  };
};

const createSingleProductOrder = (
  orderAmount: number,
  isRemoteArea = false,
): OrderData => {
  return createOrder(
    [
      {
        productId: 'product-id',
        name: '상품',
        price: orderAmount,
        image: 'example/com',
        quantity: 1,
      },
    ],
    isRemoteArea,
  );
};

const expectBestCouponSimulation = ({
  order,
  time,
  expectedCouponCodes,
  expectedDiscountAmount,
  availableCoupons = coupons,
}: {
  order: OrderData;
  time: string;
  expectedCouponCodes: string[];
  expectedDiscountAmount: number;
  availableCoupons?: Coupon[];
}) => {
  const { selectedCoupons, discountAmount } = calculateBestCouponDiscount(
    order,
    availableCoupons,
    createDateAt(time),
  );

  expect(selectedCoupons.map((coupon) => coupon.code)).toEqual(
    expectedCouponCodes,
  );
  expect(discountAmount).toBe(expectedDiscountAmount);
};

describe('최적 쿠폰 계산', () => {
  test('5만원 미만이고 2+1 조건도 없으면 미라클모닝 정율 쿠폰만 적용한다.', () => {
    expectBestCouponSimulation({
      order: createSingleProductOrder(40000),
      time: '05:00',
      expectedCouponCodes: ['MIRACLESALE'],
      expectedDiscountAmount: 12000,
    });
  });

  test('5만원 미만이고 미라클모닝 시간도 아니면 적용 가능한 쿠폰이 없다.', () => {
    expectBestCouponSimulation({
      order: createSingleProductOrder(40000),
      time: '08:00',
      expectedCouponCodes: [],
      expectedDiscountAmount: 0,
    });
  });

  test('5만원 일반 배송 주문에서는 정율 쿠폰과 무료 배송 쿠폰 조합을 적용한다.', () => {
    expectBestCouponSimulation({
      order: createSingleProductOrder(50000),
      time: '05:00',
      expectedCouponCodes: ['FREESHIPPING', 'MIRACLESALE'],
      expectedDiscountAmount: 18000,
    });
  });

  test('10만원 주문에서는 정액 쿠폰과 정율 쿠폰 조합을 적용한다.', () => {
    expectBestCouponSimulation({
      order: createSingleProductOrder(100000),
      time: '05:00',
      expectedCouponCodes: ['FIXED5000', 'MIRACLESALE'],
      expectedDiscountAmount: 33500,
    });
  });

  test('도서 산간 10만원 주문에서는 정액 쿠폰과 정율 쿠폰 조합을 적용한다.', () => {
    expectBestCouponSimulation({
      order: createSingleProductOrder(100000, true),
      time: '05:00',
      expectedCouponCodes: ['FIXED5000', 'MIRACLESALE'],
      expectedDiscountAmount: 33500,
    });
  });

  test('미라클모닝 시간이 아니고 2+1 조건을 만족하면 BOGO와 정액 쿠폰 조합을 적용한다.', () => {
    expectBestCouponSimulation({
      order: createOrder([
        {
          productId: 'product-id',
          name: '상품',
          price: 40000,
          image: 'example/com',
          quantity: 3,
        },
      ]),
      time: '08:00',
      expectedCouponCodes: ['FIXED5000', 'BOGO'],
      expectedDiscountAmount: 45000,
    });
  });

  test('미라클모닝 시간이고 2+1 조건을 만족하면 BOGO와 정율 쿠폰을 적용한다.', () => {
    expectBestCouponSimulation({
      order: createOrder([
        {
          productId: 'product-id',
          name: '상품',
          price: 40000,
          image: 'example/com',
          quantity: 3,
        },
      ]),
      time: '05:00',
      expectedCouponCodes: ['BOGO', 'MIRACLESALE'],
      expectedDiscountAmount: 64000,
    });
  });

  test('구매 수량이 6개여도 2+1 쿠폰은 상품 1개 금액만 할인한다.', () => {
    expectBestCouponSimulation({
      order: createOrder([
        {
          productId: 'product-id',
          name: '상품',
          price: 10000,
          image: 'example/com',
          quantity: 6,
        },
      ]),
      time: '08:00',
      expectedCouponCodes: ['BOGO'],
      expectedDiscountAmount: 10000,
      availableCoupons: [bogoCoupon],
    });
  });

  test('2+1 조건을 만족하는 상품이 여러 개면 가장 비싼 상품 1개 금액을 할인한다.', () => {
    expectBestCouponSimulation({
      order: createOrder([
        {
          productId: 'product-a',
          name: '상품 A',
          price: 10000,
          image: 'example/a',
          quantity: 3,
        },
        {
          productId: 'product-b',
          name: '상품 B',
          price: 30000,
          image: 'example/b',
          quantity: 3,
        },
      ]),
      time: '08:00',
      expectedCouponCodes: ['BOGO'],
      expectedDiscountAmount: 30000,
      availableCoupons: [bogoCoupon],
    });
  });
});
