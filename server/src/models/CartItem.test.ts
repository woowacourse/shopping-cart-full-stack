import {CartItem} from './CartItem.js';
import {Product} from './Product.js';

const createCartItem = () => {
  const product = new Product('1', '상품', 1000, '/image.png');

  return new CartItem('1', product, 1);
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
      product: new Product('1', '상품', 1000, '/image.png'),
      quantity: 1,
    });
  });
});
