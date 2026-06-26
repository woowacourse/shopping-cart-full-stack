import AppError from '../errors/AppError.js';
import CartItem from '../model/CartItem.js';

describe('CartItem 생성 기능 테스트', () => {
  test('유효한 정보로 생성하면 toJson()이 해당 정보를 반환한다.', () => {
    const cartItem = new CartItem(1, 3);

    expect(cartItem.toJson()).toEqual({ id: 1, orderCount: 3, isSelected: true });
  });

  test('isSelected를 생략하면 기본값 true로 선택된 상태가 된다.', () => {
    const cartItem = new CartItem(1, 3);

    expect(cartItem.toJson().isSelected).toBe(true);
  });

  test('isSelected를 false로 생성하면 toJson에 그대로 반영된다.', () => {
    const cartItem = new CartItem(1, 3, false);

    expect(cartItem.toJson()).toEqual({ id: 1, orderCount: 3, isSelected: false });
  });
});

describe('CartItem 주문 수량 검증 테스트', () => {
  test('주문 수량이 1 미만이면 에러를 발생시킨다.', () => {
    expect(() => {
      new CartItem(1, 0);
    }).toThrow(new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE'));
  });

  test('주문 수량이 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new CartItem(1, '3');
    }).toThrow(new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE'));
  });

  test('주문 수량이 빈 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new CartItem(1, '');
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));
  });

  test('주문 수량이 null이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new CartItem(1, null);
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));
  });

  test('주문 수량이 undefined이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new CartItem(1, undefined);
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));
  });
});
