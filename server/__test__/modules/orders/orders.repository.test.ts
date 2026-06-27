import { ordersDB } from '../../../src/db.js';
import { Order } from '../../../src/modules/orders/orders.model.js';
import { orderRepository } from '../../../src/modules/orders/orders.repository.js';

const createOrder = (orderId = 'order-1') =>
  new Order({
    orderId: orderId,
    products: [{ productId: 'product-1', quantity: 3 }],
    couponIds: ['coupon-5000'],
  });

describe('Order Repository', () => {
  beforeEach(() => {
    ordersDB.clear();
  });

  test('상품을 저장한다', () => {
    const order = createOrder();

    const savedOrder = orderRepository.save(order);

    expect(savedOrder).toBe(order);
  });

  test('저장된 전체 상품 목록을 조회한다', () => {
    const orderA = createOrder('order-A');
    const orderB = createOrder('order-B');

    orderRepository.save(orderA);
    orderRepository.save(orderB);

    expect(orderRepository.findAll()).toEqual([orderA, orderB]);
  });

  test('상품 id로 상품을 조회한다', () => {
    const order = createOrder();

    orderRepository.save(order);

    expect(orderRepository.findById('order-1')).toBe(order);
  });

  test('존재하지 않는 상품 id로 조회하면 undefined를 반환한다', () => {
    expect(orderRepository.findById('unknown')).toBeUndefined();
  });
});
