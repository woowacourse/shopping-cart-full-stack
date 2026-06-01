import {CartItem, isValidQuantity} from './CartItem.js';
import {Product} from './Product.js';

const createCartItem = () => {
  const product = new Product('1', '상품', 1000, '/image.png');

  return new CartItem('1', product, 1);
};

describe('CartItem', () => {
  test('isValidQuantity는 1 이상 99 이하의 정수이면 true를 반환한다', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(99)).toBe(true);
  });

  test('isValidQuantity는 범위를 벗어나거나 정수가 아니면 false를 반환한다', () => {
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(100)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
    expect(isValidQuantity('1')).toBe(false);
  });

  test('유효하지 않은 수량으로 생성할 수 없다', () => {
    const product = new Product('1', '상품', 1000, '/image.png');

    expect(() => new CartItem('1', product, -1)).toThrow('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('getQuantity는 현재 수량을 반환한다', () => {
    const cartItem = createCartItem();

    expect(cartItem.getQuantity()).toBe(1);
  });

  test('updateQuantity는 수량을 변경한다', () => {
    const cartItem = createCartItem();

    cartItem.updateQuantity(3);

    expect(cartItem.getQuantity()).toBe(3);
  });

  test('updateQuantity는 유효하지 않은 수량이면 에러를 던진다', () => {
    const cartItem = createCartItem();

    expect(() => cartItem.updateQuantity(-1)).toThrow('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('toJSON은 응답에 필요한 값을 반환한다', () => {
    const cartItem = createCartItem();

    expect(cartItem.toJSON()).toEqual({
      id: '1',
      productInfo: new Product('1', '상품', 1000, '/image.png'),
      quantity: 1,
    });
  });
});
