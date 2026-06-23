import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { getAllProducts } from '../../src/service/productService';
import {
  calculateOrderCouponDiscount,
  updateOrderCoupons,
  createOrder,
  getOrder,
  getOrderCoupons,
  updateOrderRemoteArea,
} from '../../src/service/orderService';

function setCurrentTime(hour: number, day = 17) {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 5, day, hour));
}

describe('주문 서비스 테스트', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test('주문 생성 시 최적 쿠폰 조합과 할인 금액을 주문서에 반영한다.', () => {
    setCurrentTime(5);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    const order = getOrder(id);
    const orderCoupons = getOrderCoupons(id);

    expect(order.amount.orderAmount).toBe(105000);
    expect(order.amount.discountAmount).toBe(56000);
    expect(order.amount.totalAmount).toBe(49000);
    expect(
      orderCoupons
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['BOGO', 'MIRACLESALE']);
  });

  test('사용자가 쿠폰을 선택하면 주문서 DB는 바꾸지 않고 계산 결과만 미리 보여준다.', () => {
    setCurrentTime(5);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    const couponDiscountResult = calculateOrderCouponDiscount(id, [
      'FIXED5000',
    ]);
    const savedOrder = getOrder(id);
    const orderCoupons = getOrderCoupons(id);

    expect(couponDiscountResult).toEqual({ discountAmount: 5000 });
    expect(savedOrder.amount.discountAmount).toBe(56000);
    expect(savedOrder.amount.totalAmount).toBe(49000);
    expect(
      orderCoupons
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['BOGO', 'MIRACLESALE']);
  });

  test('쿠폰 사용을 확정하면 선택 쿠폰과 할인 금액을 주문서 DB에 반영한다.', () => {
    setCurrentTime(5);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    calculateOrderCouponDiscount(id, ['FIXED5000']);
    const order = updateOrderCoupons(id, ['FIXED5000']);

    expect(order.amount.discountAmount).toBe(5000);
    expect(order.amount.totalAmount).toBe(100000);
    expect(
      getOrderCoupons(id)
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['FIXED5000']);
  });

  test('사용자가 여러 쿠폰을 직접 선택하면 최적 조합으로 바꾸지 않고 선택한 쿠폰 그대로 적용한다.', () => {
    setCurrentTime(5);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    const couponDiscountResult = calculateOrderCouponDiscount(id, [
      'FIXED5000',
      'BOGO',
    ]);
    const savedOrder = getOrder(id);
    const orderCoupons = getOrderCoupons(id);

    expect(couponDiscountResult).toEqual({ discountAmount: 40000 });
    expect(savedOrder.amount.discountAmount).toBe(56000);
    expect(savedOrder.amount.totalAmount).toBe(49000);
    expect(
      orderCoupons
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['BOGO', 'MIRACLESALE']);
  });

  test('쿠폰 사용 확정 전 도서 산간 여부를 변경하면 최적 쿠폰과 할인 금액을 다시 계산한다.', () => {
    setCurrentTime(5);

    const product = getAllProducts()[1].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 2 }]);

    const order = updateOrderRemoteArea(id, true);
    const orderCoupons = getOrderCoupons(id);

    expect(order.isRemoteArea).toBe(true);
    expect(order.amount.shippingFee).toBe(6000);
    expect(order.amount.discountAmount).toBe(21000);
    expect(order.amount.totalAmount).toBe(35000);
    expect(
      orderCoupons
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['FREESHIPPING', 'MIRACLESALE']);
  });

  test('쿠폰 사용 확정 후 도서 산간 여부를 변경하면 할인 금액은 유지하고 배송비만 변경한다.', () => {
    setCurrentTime(8);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    updateOrderCoupons(id, ['FIXED5000']);
    const order = updateOrderRemoteArea(id, true);

    expect(order.isRemoteArea).toBe(true);
    expect(order.amount.discountAmount).toBe(5000);
    expect(order.amount.shippingFee).toBe(3000);
    expect(order.amount.totalAmount).toBe(103000);
    expect(
      getOrderCoupons(id)
        .filter(({ isSelected }) => isSelected)
        .map(({ code }) => code),
    ).toEqual(['FIXED5000']);
  });

  test('2+1 조건을 만족하지 않는 쿠폰은 비활성화한다.', () => {
    setCurrentTime(8);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 2 }]);

    const bogoCoupon = getOrderCoupons(id).find(({ code }) => code === 'BOGO');

    expect(bogoCoupon?.isDisabled).toBe(true);
  });

  test('만료일이 지난 쿠폰은 비활성화한다.', () => {
    setCurrentTime(5, 31);

    const product = getAllProducts()[0].getProduct();
    const { id } = createOrder([{ productId: product.id, quantity: 3 }]);

    const bogoCoupon = getOrderCoupons(id).find(({ code }) => code === 'BOGO');

    expect(bogoCoupon?.isDisabled).toBe(true);
  });
});
