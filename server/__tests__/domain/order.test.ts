import { describe, expect, test } from '@jest/globals';
import Order from '../../src/domain/Order';

describe('주문서 도메인 테스트', () => {
  const data = [
    {
      productId: '1',
      name: '나이키',
      price: 25000,
      image: 'example/com',
      quantity: 2,
    },
    {
      productId: '2',
      name: '아디다스',
      price: 30000,
      image: 'example/com',
      quantity: 1,
    },
  ];

  const order = new Order();

  order.createOrder(data);

  test('상품을 받아 주문서에 저장한다.', () => {
    const orderData = order.getOrder();

    expect(orderData.id).toBe(order.getId());
    expect(orderData.products).toEqual(data);
  });

  test('상품을 받아 결제 금액을 계산한다.', () => {
    const orderData = order.getOrder();

    expect(orderData.amount.orderAmount).toBe(80000);
  });

  test('도서 산간 지역이면 배송비가 추가된다.', () => {
    order.setRemoteArea(true);

    const orderData = order.getOrder();

    expect(orderData.amount.shippingFee).toBe(6000);
  });

  test('사용자가 쿠폰 선택을 확정했는지 저장한다.', () => {
    const newOrder = new Order();
    newOrder.createOrder(data);

    expect(newOrder.hasConfirmedCouponSelection()).toBe(false);

    newOrder.confirmCouponSelection();

    expect(newOrder.hasConfirmedCouponSelection()).toBe(true);
  });
});
