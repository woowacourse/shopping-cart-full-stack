import { describe, expect, test } from '@jest/globals';
import ShoppingCart from '../../src/domain/ShoppingCart';

describe('쇼핑 장바구니 도메인 테스트', () => {
  test('쇼핑 장바구니의 수량은 1 이상 99 이하의 정수이다.', () => {
    const data = {
      id: 'testId',
      quantity: 3,
    };

    const shoppingCart = new ShoppingCart(data);

    expect(shoppingCart.getShoppingCart().quantity).toBe(3);
  });
});
