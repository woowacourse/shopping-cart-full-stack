import {jest} from '@jest/globals';

const loadCartService = async () => {
  jest.resetModules();
  return import('./CartService.js');
};

describe('cartService', () => {
  test('getCartItems는 장바구니 항목 목록을 반환한다', async () => {
    const {cartService} = await loadCartService();

    expect(cartService.getCartItems()).toHaveLength(3);
  });

  test('updateQuantity는 장바구니 항목 수량을 변경한다', async () => {
    const {cartService} = await loadCartService();

    expect(cartService.updateQuantity('1', 3)).toBe(3);
  });

  test('updateQuantity는 유효하지 않은 수량이면 에러를 던진다', async () => {
    const {cartService} = await loadCartService();

    expect(() => cartService.updateQuantity('1', 0)).toThrow('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('updateQuantity는 없는 항목이면 에러를 던진다', async () => {
    const {cartService} = await loadCartService();

    expect(() => cartService.updateQuantity('999', 3)).toThrow();
  });

  test('deleteCartItem은 장바구니 항목을 삭제한다', async () => {
    const {cartService} = await loadCartService();

    expect(cartService.deleteCartItem('1')).toBeUndefined();
    expect(cartService.getCartItems()).toHaveLength(2);
  });

  test('deleteCartItem은 없는 항목이면 에러를 던진다', async () => {
    const {cartService} = await loadCartService();

    expect(() => cartService.deleteCartItem('999')).toThrow();
  });
});
