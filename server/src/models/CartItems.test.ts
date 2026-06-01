import {CartItem} from './CartItem.js';
import {CartItems} from './CartItems.js';
import {Product} from './Product.js';

const createCartItems = () => {
  const product1 = new Product('1', '상품1', 1000, '/image1.png');
  const product2 = new Product('2', '상품2', 2000, '/image2.png');

  return new CartItems([
    new CartItem('1', product1, 1),
    new CartItem('2', product2, 2),
  ]);
};

describe('CartItems', () => {
  test('findAll은 장바구니 항목 목록 복사본을 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.findAll()).toHaveLength(2);
    expect(cartItems.findAll()).not.toBe(cartItems.findAll());
  });

  test('findById는 id에 해당하는 장바구니 항목을 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.findById('1')?.id).toBe('1');
  });

  test('findById는 없는 id이면 undefined를 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.findById('999')).toBeUndefined();
  });

  test('updateQuantity는 수량을 변경하고 항목을 반환한다', () => {
    const cartItems = createCartItems();
    const updatedCartItem = cartItems.updateQuantity('1', 3);

    expect(updatedCartItem?.getQuantity()).toBe(3);
  });

  test('updateQuantity는 없는 항목이면 null을 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.updateQuantity('999', 3)).toBeNull();
  });

  test('deleteById는 장바구니 항목을 삭제하고 true를 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.deleteById('1')).toBe(true);
    expect(cartItems.findById('1')).toBeUndefined();
  });

  test('deleteById는 없는 항목이면 false를 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.deleteById('999')).toBe(false);
  });

  test('deleteByProductId는 상품 id에 해당하는 항목을 삭제하고 true를 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.deleteByProductId('1')).toBe(true);
    expect(cartItems.findById('1')).toBeUndefined();
  });

  test('deleteByProductId는 없는 상품 id이면 false를 반환한다', () => {
    const cartItems = createCartItems();

    expect(cartItems.deleteByProductId('999')).toBe(false);
  });
});
