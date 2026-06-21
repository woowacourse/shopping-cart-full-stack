import {Order} from '../Order.js';

const createOrder = () => {
  return new Order(
    '1',
    [
      {
        productId: '1',
        name: '상품1',
        price: 1000,
        imageUrl: '/image1.png',
        quantity: 2,
      },
      {
        productId: '2',
        name: '상품2',
        price: 2000,
        imageUrl: '/image2.png',
        quantity: 3,
      },
    ],
    8000
  );
};

describe('Order', () => {
  test('getItemCount는 주문 상품 종류 수를 반환한다', () => {
    const order = createOrder();

    expect(order.getItemCount()).toBe(2);
  });

  test('getTotalQuantity는 주문 상품 총 수량을 반환한다', () => {
    const order = createOrder();

    expect(order.getTotalQuantity()).toBe(5);
  });

  test('getTotalAmount는 주문 총 결제 금액을 반환한다', () => {
    const order = createOrder();

    expect(order.getTotalAmount()).toBe(8000);
  });
});
