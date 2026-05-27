//서비스와 레포지를 이용해서 기능을 도작하게 한다

import { cartItemsDB } from '../../../src/db.js';
import { CartItem } from '../../../src/modules/cart/cartItem.model.js';
import { cartItemService } from '../../../src/modules/cart/cartItem.service.js';

describe('CartItemService', () => {
  beforeEach(() => {
    cartItemsDB.clear();
  });

  // 상품을 조회하는 기능
  describe('상품 조회 기능 테스트', () => {
    test('', () => {
      // given
      const cartItemA = cartItemService.addCartItem('1');

      const cartItemB = cartItemService.addCartItem('2');

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(2);
      expect(cartItems[0].cartItemId).toBe(cartItemA.cartItemId);
      expect(cartItems[1].cartItemId).toBe(cartItemB.cartItemId);
    });

    test('존재하지 않은 상품 조회 시 에러를 반환한다.', () => {
      expect(() => {
        cartItemService.getCartItemById('1123');
      }).toThrow('존재하지 않는 상품입니다.');
    });
  });

  // 상품을 추가하는 기능
  test('상품 추가 기능 테스트', () => {
    // given
    const response = cartItemService.addCartItem('1');

    // when
    const cartItems = cartItemService.getCartItems();

    // then
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].cartItemId).toBe(response.cartItemId);
  });

  // 상품을 삭제하는 기능
  describe('상품 삭제 기능 테스트', () => {
    test('상품을 삭제할 수 있다.', () => {
      // given
      const response = cartItemService.addCartItem('1');

      cartItemService.deleteCartItem(response.cartItemId);

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(0);
    });

    test('존재하지 않은 상품 삭제 시 에러를 반환한다.', () => {
      expect(() => {
        cartItemService.deleteCartItem('1');
      }).toThrow('존재하지 않는 상품입니다.');
    });
  });

  // 상품의 개수를 수정하는 기능
  describe('상품 개수 수정 기능 테스트', () => {
    test('수량 변경한다', () => {
      const response = cartItemService.addCartItem('1');

      cartItemService.changePurchaseQuantity(response.cartItemId, 2);

      const cartItem = cartItemService.getCartItemById(response.cartItemId);

      expect(cartItem.purchaseQuantity).toEqual(2);
    });
  });
});
