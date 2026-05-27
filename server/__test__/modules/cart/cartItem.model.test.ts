import { CartItem } from '../../../src/modules/cart/cartItem.model.js';

describe('cart 모델 테스트', () => {
  test('상품 생성', () => {
    const mockCartItem = {
      cartItemId: '10',
      productId: '1',
      purchaseQuantity: 25,
    };
    const cartItem = new CartItem(mockCartItem);

    expect(cartItem.cartItemId).toEqual('10');
    expect(cartItem.productId).toEqual('1');
    expect(cartItem.purchaseQuantity).toEqual(25);
  });

  test('상품 수량이 정수가 아닐 때 에러 발생', () => {
    const mockCartItem = {
      cartItemId: '10',
      productId: '1',
      purchaseQuantity: 1.5,
    };

    expect(() => {
      new CartItem(mockCartItem);
    }).toThrow('수량은 정수여야 합니다.');
  });
});
