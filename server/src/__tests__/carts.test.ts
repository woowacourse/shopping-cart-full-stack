import AppError from '../errors/AppError.js';
import Cart from '../model/Cart.js';

describe('장바구니 상품 수량 변경 기능 테스트', () => {
  test('상품 1개를 추가하면, 해당 상품의 주문 수량이 1 증가한다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;

    // when
    cart.addCartItem(productId, 1);
    cart.setOrderCount(productId, 2);

    // then
    expect(cart.getOrderCount(productId)).toBe(2);
  });

  test('상품 1개를 줄이면, 해당 상품의 주문 수량이 1 감소한다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;

    // when
    cart.addCartItem(productId, 2);
    cart.setOrderCount(productId, 1);

    // then
    expect(cart.getOrderCount(productId)).toBe(1);
  });
});

describe('장바구니 상품 수량 변경 예외 테스트', () => {
  test('상품 수량이 1 이상의 정수가 아닐때 에러를 발생시킨다.', () => {
    // given
    const cart = new Cart();

    const productId = 1;
    cart.addCartItem(productId, 1);

    // when & then
    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(productId, 'abc');
    }).toThrow(new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE'));

    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(productId, '2');
    }).toThrow(new AppError('INVALID_PRODUCT_ORDER_COUNT_TYPE'));
  });

  test('장바구니에 존재하지 않는 상품의 수량을 변경하면 에러를 발생시킨다.', () => {
    // given
    const cart = new Cart();
    const wrongProductId = 999;

    // when & then
    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(wrongProductId, 2);
    }).toThrow(new AppError('PRODUCT_NOT_EXIST_FOR_ORDER'));
  });

  test('필수 필드 누락 시 에러를 응답한다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;

    cart.addCartItem(productId, 1);

    // when & then
    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(productId, '');
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));

    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(productId, null);
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));

    expect(() => {
      // @ts-ignore 예외 처리를 위한 타입 무시
      cart.setOrderCount(productId, undefined);
    }).toThrow(new AppError('EMPTY_PRODUCT_ORDER_COUNT'));
  });
});

describe('장바구니 상품 삭제 기능 테스트', () => {
  test('장바구니에 담긴 상품을 삭제하면, 해당 상품이 장바구니 상품 목록에서 삭제된다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;
    cart.addCartItem(productId, 1);

    // when
    cart.deleteCartItem(productId);

    // then
    expect(cart.getOrderCount(productId)).toBe(undefined);
  });
});

describe('장바구니 상품 삭제 예외 테스트', () => {
  test('장바구니에 존재하지 않는 상품을 제거했을 때 에러를 발생시킨다.', () => {
    // given
    const cart = new Cart();
    const wrongProductId = 999;

    // when & then
    expect(() => {
      cart.deleteCartItem(wrongProductId);
    }).toThrow(new AppError('PRODUCT_NOT_EXIST_IN_CART'));
  });
});
