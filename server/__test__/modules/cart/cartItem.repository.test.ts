import { productsDB, userDB } from '../../../src/db.js';
import { CartItem } from '../../../src/modules/cart/cartItem.model.js';
import { cartItemRepository } from '../../../src/modules/cart/cartItem.repository.js';
import { Product } from '../../../src/modules/products/product.model.js';

const createCartItem = (cartItemId = '1') =>
  new CartItem({
    cartItemId,
    productId: '1',
    purchaseQuantity: 25,
  });

describe('CartItemRepository', () => {
  beforeEach(() => {
    userDB[0].cartItemsDB.clear();
  });

  test('장바구니에 상품을 저장한다', () => {
    const cartItem = createCartItem();

    const savedCartItem = cartItemRepository.save(cartItem);

    expect(savedCartItem).toBe(cartItem);
  });

  test('장바구니에 담긴 전체 상품 목록을 조회한다', () => {
    const cartItemA = createCartItem('1');
    const cartItemB = createCartItem('2');

    cartItemRepository.save(cartItemA);
    cartItemRepository.save(cartItemB);

    expect(cartItemRepository.findAll()).toEqual([cartItemA, cartItemB]);
  });

  test('상품 id로 상품을 조회한다', () => {
    const cartItem = createCartItem();

    cartItemRepository.save(cartItem);

    expect(cartItemRepository.findById('1')).toBe(cartItem);
  });

  test('존재하지 않는 상품 id로 조회하면 undefined를 반환한다', () => {
    expect(cartItemRepository.findById('unknown')).toBeUndefined();
  });

  test('상품을 삭제한다', () => {
    const cartItem = createCartItem();

    cartItemRepository.save(cartItem);
    cartItemRepository.deleteById('1');

    expect(cartItemRepository.findById('1')).toBeUndefined();
    expect(cartItemRepository.findAll()).toEqual([]);
  });
});
