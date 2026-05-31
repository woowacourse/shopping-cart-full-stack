import { describe, expect, test } from '@jest/globals';
import ShoppingCart from '../../src/domain/ShoppingCart';

describe('쇼핑 장바구니 도메인 테스트', () => {
  test('쇼핑 장바구니의 수량은 1 이상 99 이하의 정수이다.', () => {
    const shoppingCart = new ShoppingCart('testId', 3);

    expect(shoppingCart.productId).toBe('testId');
    expect(shoppingCart.quantity).toBe(3);
  });
});

describe('쇼핑 장바구니 도메인 예외 테스트', () => {
  test('장바구니 상품 수량이 정수가 아니면 예외 처리한다.', () => {
    expect(() => new ShoppingCart('testId', 1.5)).toThrow(
      '유효하지 않은 수량입니다.',
    );
  });

  test('장바구니 상품 수량이 0 이하이면 예외 처리한다.', () => {
    expect(() => new ShoppingCart('testId', 0)).toThrow(
      '상품 수량이 1 이상이어야 합니다.',
    );
  });

  test('장바구니 상품 수량이 100 이상이면 예외 처리한다.', () => {
    expect(() => new ShoppingCart('testId', 100)).toThrow(
      '상품 수량이 99 이하여야 합니다.',
    );
  });
});
