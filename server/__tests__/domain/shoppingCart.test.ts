import { describe, expect, test } from '@jest/globals';
import ShoppingCart from '../../src/domain/ShoppingCart';

describe('쇼핑 장바구니 도메인 테스트', () => {
  test('쇼핑 장바구니의 수량은 1 이상 99 이하의 정수이다.', () => {
    const data = {
      id: 'testId',
      quantity: 3,
    };

    const shoppingCart = new ShoppingCart();
    shoppingCart.add(data);

    expect(shoppingCart.getQuantity('testId')).toBe(3);
  });
});

describe('쇼핑 장바구니 도메인 예외 테스트', () => {
  test('장바구니 상품 수량이 0 이하이면 예외 처리한다.', () => {
    const data = {
      id: 'testId',
      quantity: 0,
    };

    const shoppingCart = new ShoppingCart();

    expect(() => shoppingCart.add(data)).toThrow(
      '상품 수량이 1 이상이어야 합니다.',
    );
  });

  test('장바구니 상품 수량이 100 이상이면 예외 처리한다.', () => {
    const data = {
      id: 'testId',
      quantity: 100,
    };

    const shoppingCart = new ShoppingCart();

    expect(() => shoppingCart.add(data)).toThrow(
      '상품 수량이 99 이하여야 합니다.',
    );
  });
});
