//서비스와 레포지를 이용해서 기능을 도작하게 한다

import { cartItemsDB, productsDB } from '../../../src/db.js';
import { CartItem } from '../../../src/modules/cart/cartItem.model.js';
import type { CartItemRepository } from '../../../src/modules/cart/cartItem.repository.js';
import {
  CartItemService,
  cartItemService,
} from '../../../src/modules/cart/cartItem.service.js';
import { Product } from '../../../src/modules/products/product.model.js';
import type { ProductRepository } from '../../../src/modules/products/product.repository.js';

const createProduct = (productId: string) =>
  new Product({
    productId,
    productName: '콜라',
    productPrice: 1300,
    remainingQuantity: 25,
    imageUrl: 'src/assets/coke.png',
  });

describe('CartItemService', () => {
  beforeEach(() => {
    cartItemsDB.clear();
    productsDB.clear();
    productsDB.set('1', createProduct('1'));
    productsDB.set('2', createProduct('2'));
  });

  // 상품을 조회하는 기능
  describe('상품 조회 기능 테스트', () => {
    test('', () => {
      // given
      const cartItemA = cartItemService.addCartItem('1', 1);

      const cartItemB = cartItemService.addCartItem('2', 1);

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(2);
      expect(cartItems[0].cartItemId).toBe(cartItemA.cartItemId);
      expect(cartItems[1].cartItemId).toBe(cartItemB.cartItemId);
    });

    test('장바구니 목록 조회 시 상품 정보(이름/가격/이미지)를 함께 반환한다.', () => {
      // given
      cartItemService.addCartItem('1', 2);

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems[0]).toEqual({
        cartItemId: expect.any(String),
        productId: '1',
        productName: '콜라',
        productPrice: 1300,
        imageUrl: 'src/assets/coke.png',
        purchaseQuantity: 2,
      });
    });

    test('존재하지 않은 장바구니 상품 조회 시 에러를 반환한다.', () => {
      expect(() => {
        cartItemService.getCartItemById('1123');
      }).toThrow('존재하지 않는 장바구니 상품입니다.');
    });
  });

  // 상품을 추가하는 기능
  describe('상품 추가 기능 테스트', () => {
    test('상품을 추가할 수 있다.', () => {
      // given
      const response = cartItemService.addCartItem('1', 1);

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].cartItemId).toBe(response.cartItemId);
    });

    test('장바구니에 이미 존재하는 상품을 다시 추가할 경우 장바구니에 담긴 수량을 1 증가시킨다.', () => {
      // given
      const responseA = cartItemService.addCartItem('1', 1);

      // when
      const responseB = cartItemService.addCartItem('1', 1);

      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(1);
      expect(cartItems[0].purchaseQuantity).toBe(2);
    });
  });

  // 상품을 삭제하는 기능
  describe('상품 삭제 기능 테스트', () => {
    test('상품을 삭제할 수 있다.', () => {
      // given
      const response = cartItemService.addCartItem('1', 1);

      cartItemService.deleteCartItem(response.cartItemId);

      // when
      const cartItems = cartItemService.getCartItems();

      // then
      expect(cartItems).toHaveLength(0);
    });

    test('존재하지 않은 장바구니 상품 삭제 시 에러를 반환한다.', () => {
      expect(() => {
        cartItemService.deleteCartItem('1');
      }).toThrow('존재하지 않는 장바구니 상품입니다.');
    });
  });

  // 상품의 개수를 수정하는 기능
  describe('상품 개수 수정 기능 테스트', () => {
    test('수량 변경한다', () => {
      const response = cartItemService.addCartItem('1', 1);

      cartItemService.changePurchaseQuantity(response.cartItemId, 2);

      const cartItem = cartItemService.getCartItemById(response.cartItemId);

      expect(cartItem.purchaseQuantity).toEqual(2);
    });
  });

  // 의존성 주입: 실제 저장소 없이 가짜 repository를 주입해 동작을 검증할 수 있다
  describe('repository 주입 테스트', () => {
    test('주입한 repository로 장바구니 목록을 조회한다.', () => {
      const storedCartItem = new CartItem({
        cartItemId: 'c1',
        productId: 'p1',
        purchaseQuantity: 3,
      });

      const fakeCartItemRepository: CartItemRepository = {
        findAll: () => [storedCartItem],
        save: (cartItem) => cartItem,
        findById: () => undefined,
        findByProductId: () => undefined,
        deleteById: () => true,
        deleteByProductId: () => {},
      };
      const fakeProductRepository: ProductRepository = {
        findById: () => createProduct('p1'),
        findAll: () => [],
        save: (product) => product,
        deleteById: () => true,
      };

      const service = new CartItemService(
        fakeCartItemRepository,
        fakeProductRepository,
      );

      expect(service.getCartItems()).toEqual([
        {
          cartItemId: 'c1',
          productId: 'p1',
          productName: '콜라',
          productPrice: 1300,
          imageUrl: 'src/assets/coke.png',
          purchaseQuantity: 3,
        },
      ]);
    });
  });
});
