import Cart from '../Cart.js';

const mockCartItem = new Map();
mockCartItem.set(1, 3);
mockCartItem.set(2, 5);

describe('장바구니 상품 수량 변경 기능 테스트', () => {
  test('상품 1개를 추가하면, 해당 상품의 주문 수량이 1 증가한다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;
    const orderCount = 5;

    // when
    cart.updateProductQuantity(productId, orderCount);

    // then
    expect(cart.getOrderCount(productId)).toBe(orderCount);
  });

  test('상품 1개를 줄이면, 해당 상품의 주문 수량이 1 감소한다.', () => {
    // given
    const cart = new Cart();
    const productId = 1;
    const orderCount = 2;

    // when
    cart.updateProductQuantity(productId, orderCount);

    // then
    expect(cart.getOrderCount(productId)).toBe(orderCount);
  });
});
