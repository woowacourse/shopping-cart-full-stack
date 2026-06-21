import {Order} from '../Order.js';
import {Orders} from '../Orders.js';

const createOrder = (id: string) => {
  return new Order(id, [], [], 0);
};

describe('Orders', () => {
  test('add는 주문을 추가한다', () => {
    const orders = new Orders();
    const order = createOrder('1');

    orders.add(order);

    expect(orders.findById('1')).toBe(order);
  });

  test('findById는 id에 해당하는 주문을 반환한다', () => {
    const order = createOrder('1');
    const orders = new Orders([order]);

    expect(orders.findById('1')).toBe(order);
  });

  test('findById는 없는 id이면 undefined를 반환한다', () => {
    const orders = new Orders();

    expect(orders.findById('999')).toBeUndefined();
  });
});
