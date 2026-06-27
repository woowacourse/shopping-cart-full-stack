import {CartItem} from './CartItem.js';

const createCartItem = () => {
  return new CartItem('1', '1', 1);
};

describe('CartItem', () => {
  test('getQuantity는 현재 수량을 반환한다', () => {
    const cartItem = createCartItem();

    expect(cartItem.getQuantity()).toBe(1);
  });

  test('updateQuantity는 수량을 변경한다', () => {
    const cartItem = createCartItem();

    cartItem.updateQuantity(3);

    expect(cartItem.getQuantity()).toBe(3);
  });

  test('toJSON은 응답에 필요한 값을 반환한다', () => {
    const cartItem = createCartItem();

    expect(cartItem.toJSON()).toEqual({
      id: '1',
      productId: '1',
      quantity: 1,
    });
  });
});
