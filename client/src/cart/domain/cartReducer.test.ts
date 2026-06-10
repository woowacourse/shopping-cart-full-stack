import {cartItemsReducer} from './cartReducer.js';
import type {CartItem, CartItemsState} from './types.js';

const cartItems: CartItem[] = [
  {
    id: 'cart-1',
    productInfo: {id: 'product-hoodie', name: '후드 집업', price: 10000, imageUrl: '/hoodie.png'},
    quantity: 2,
  },
  {
    id: 'cart-2',
    productInfo: {id: 'product-denim', name: '데님 팬츠', price: 30000, imageUrl: '/denim-pants.png'},
    quantity: 1,
  },
];

const cartItemsState: CartItemsState = {
  status: 'success',
  items: cartItems,
  errorMessage: '',
};

describe('cartItemsReducer', () => {
  test('fetchStart는 로딩 상태로 변경하고 에러 메시지를 초기화한다', () => {
    const state = {...cartItemsState, errorMessage: '에러'};

    const result = cartItemsReducer(state, {type: 'fetchStart'});

    expect(result.status).toBe('loading');
    expect(result.errorMessage).toBe('');
  });

  test('fetchSuccess는 장바구니 상품과 선택 id를 저장하고 에러 메시지를 초기화한다', () => {
    const state = {...cartItemsState, errorMessage: '이전 에러'};

    const result = cartItemsReducer(state, {
      type: 'fetchSuccess',
      payload: {items: cartItems},
    });

    expect(result.status).toBe('success');
    expect(result.items).toEqual(cartItems);
    expect(result.errorMessage).toBe('');
  });

  test('fetchError는 에러 상태와 에러 메시지를 저장한다', () => {
    const result = cartItemsReducer(cartItemsState, {
      type: 'fetchError',
      payload: {errorMessage: '장바구니를 불러오지 못했습니다.'},
    });

    expect(result.status).toBe('error');
    expect(result.errorMessage).toBe('장바구니를 불러오지 못했습니다.');
  });

  test('updateCartItemQuantity는 해당 상품의 수량만 변경한다', () => {
    const result = cartItemsReducer(cartItemsState, {
      type: 'updateCartItemQuantity',
      payload: {cartItemId: 'cart-1', quantity: 5},
    });

    expect(result.items[0].quantity).toBe(5);
    expect(result.items[1].quantity).toBe(1);
  });

  test('deleteCartItem은 해당 상품을 제거한다', () => {
    const result = cartItemsReducer(cartItemsState, {
      type: 'deleteCartItem',
      payload: {cartItemId: 'cart-1'},
    });

    expect(result.items).toEqual([cartItems[1]]);
  });
});
