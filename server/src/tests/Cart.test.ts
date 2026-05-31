import Cart from '../models/Cart.js';

describe('Cart Tests', () => {
  test('카트는 상품id와 수량을 전달받으면 해당 데이터를 items에 업데이트한다.', () => {
    const cart = new Cart();
    cart.updateItemByProductId('1234-1234', 10);

    expect(cart.getAllItems()).toEqual([
      { product_id: '1234-1234', quantity: 10 },
    ]);
  });

  test('카트내 모든 아이템들을 반환한다.', () => {
    const cart = new Cart();
    cart.updateItemByProductId('123', 10);
    cart.updateItemByProductId('456', 20);
    expect(cart.getAllItems()).toEqual([
      { product_id: '123', quantity: 10 },
      { product_id: '456', quantity: 20 },
    ]);
  });

  test('카트 내 아이템이 존재하면 true를 반환한다.', () => {
    const cart = new Cart();
    cart.updateItemByProductId('123', 10);
    expect(cart.hasItemByProductId('123')).toBeTruthy();
  });

  test('카트내 아이템을 제거한다.', () => {
    const cart = new Cart();
    cart.updateItemByProductId('123', 10);
    expect(cart.deleteItemByProductId('123')).toBeTruthy();
  });
});
