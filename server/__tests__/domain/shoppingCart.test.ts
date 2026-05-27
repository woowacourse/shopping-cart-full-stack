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

  test('해당 장바구니 상품의 수량을 증가시킨다.', () => {
    const data1 = {
      id: 'testId1',
      quantity: 3,
    };

    const data2 = {
      id: 'testId1',
      quantity: 5,
    };

    const shoppingCart = new ShoppingCart();
    shoppingCart.add(data1);
    shoppingCart.setQuantity(data2.id, data2.quantity);

    expect(shoppingCart.getQuantity('testId1')).toBe(5);
  });

  test('해당 장바구니 상품의 수량을 감소시킨다.', () => {
    const data1 = {
      id: 'testId1',
      quantity: 3,
    };

    const data2 = {
      id: 'testId1',
      quantity: 1,
    };

    const shoppingCart = new ShoppingCart();
    shoppingCart.add(data1);
    shoppingCart.setQuantity(data2.id, data2.quantity);

    expect(shoppingCart.getQuantity('testId1')).toBe(1);
  });

  // 3. 상품 삭제할 때
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
