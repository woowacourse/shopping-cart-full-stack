import {act, renderHook, waitFor} from '@testing-library/react';
import {http, HttpResponse} from 'msw';

import {CartProvider, useCart} from './useCart.js';
import type {CartItem} from '../domain/types.js';
import {mockServer} from '../../test/mockServer.js';

const API_BASE_URL = 'https://paradi-easter.up.railway.app';

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

beforeEach(() => {
  localStorage.clear();
});

function mockGetCartItems(items: CartItem[]) {
  mockServer.use(
    http.get(`${API_BASE_URL}/carts`, () => {
      return HttpResponse.json({body: items});
    })
  );
}

function renderUseCart() {
  return renderHook(() => useCart(), {wrapper: CartProvider});
}

describe('useCart', () => {
  test('저장된 선택 상태가 없으면 장바구니 조회 후 전체 선택한다', async () => {
    mockGetCartItems(cartItems);

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    expect(result.current.cartItemsState.items).toEqual(cartItems);
    expect(result.current.selectedIds).toEqual(['cart-1', 'cart-2']);
  });

  test('저장된 빈 선택 상태가 있으면 전체 해제 상태를 유지한다', async () => {
    localStorage.setItem('shopping-cart-selected-cart-item-ids', JSON.stringify([]));
    mockGetCartItems(cartItems);

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    expect(result.current.selectedIds).toEqual([]);
  });

  test('저장된 선택 id 중 삭제된 장바구니 항목 id는 제외한다', async () => {
    localStorage.setItem('shopping-cart-selected-cart-item-ids', JSON.stringify(['cart-2', 'cart-999']));
    mockGetCartItems(cartItems);

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    expect(result.current.selectedIds).toEqual(['cart-2']);
  });

  test('장바구니 조회에 실패하면 에러 상태로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: {message: '장바구니를 불러오지 못했습니다.'}}, {status: 500});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('error');
    });

    expect(result.current.cartItemsState.errorMessage).toBe('장바구니를 불러오지 못했습니다.');
  });

  test('장바구니 조회 실패 후 다시 조회하면 성공 상태로 복구한다', async () => {
    let requestCount = 0;

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        requestCount += 1;

        if (requestCount === 1) {
          return HttpResponse.json({body: {message: '장바구니를 불러오지 못했습니다.'}}, {status: 500});
        }

        return HttpResponse.json({body: cartItems});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('error');
    });

    expect(result.current.cartItemsState.errorMessage).toBe('장바구니를 불러오지 못했습니다.');

    await act(async () => {
      await result.current.loadCartItems();
    });

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    expect(result.current.cartItemsState.items).toEqual(cartItems);
    expect(result.current.selectedIds).toEqual(['cart-1', 'cart-2']);
    expect(result.current.cartItemsState.errorMessage).toBe('');
  });

  test('선택 id 목록을 변경하고 저장한다', async () => {
    mockGetCartItems(cartItems);

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    act(() => {
      result.current.changeSelectedCartItemIds(['cart-2']);
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual(['cart-2']);
    });

    expect(localStorage.getItem('shopping-cart-selected-cart-item-ids')).toBe(JSON.stringify(['cart-2']));
  });

  test('장바구니 항목 수량을 변경한다', async () => {
    let requestBody: unknown;

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: cartItems});
      }),
      http.patch(`${API_BASE_URL}/carts/cart-1`, async ({request}) => {
        requestBody = await request.json();

        return HttpResponse.json({body: {id: 'cart-1', quantity: 5}});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    await act(async () => {
      await result.current.changeCartItemQuantity('cart-1', 5);
    });

    expect(requestBody).toEqual({quantity: 5});
    expect(result.current.cartItemsState.items[0].quantity).toBe(5);
    expect(result.current.cartItemsState.items[1].quantity).toBe(1);
  });

  test('장바구니 항목 수량 변경에 실패하면 에러 상태로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: cartItems});
      }),
      http.patch(`${API_BASE_URL}/carts/cart-1`, () => {
        return HttpResponse.json({body: {message: '수량은 1 이상 99 이하의 정수여야 합니다.'}}, {status: 400});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    await act(async () => {
      await result.current.changeCartItemQuantity('cart-1', 100);
    });

    expect(result.current.cartItemsState.status).toBe('error');
    expect(result.current.cartItemsState.errorMessage).toBe('수량은 1 이상 99 이하의 정수여야 합니다.');
  });

  test('장바구니 항목을 삭제한다', async () => {
    let isDeleteRequested = false;

    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: cartItems});
      }),
      http.delete(`${API_BASE_URL}/carts/cart-1`, () => {
        isDeleteRequested = true;

        return new HttpResponse(null, {status: 204});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    await act(async () => {
      await result.current.removeCartItem('cart-1');
    });

    expect(isDeleteRequested).toBe(true);
    expect(result.current.cartItemsState.items).toEqual([cartItems[1]]);
    expect(result.current.selectedIds).toEqual(['cart-2']);
  });

  test('장바구니 항목 삭제에 실패하면 에러 상태로 변경한다', async () => {
    mockServer.use(
      http.get(`${API_BASE_URL}/carts`, () => {
        return HttpResponse.json({body: cartItems});
      }),
      http.delete(`${API_BASE_URL}/carts/cart-1`, () => {
        return HttpResponse.json({body: {message: '장바구니 항목을 찾을 수 없습니다.'}}, {status: 404});
      })
    );

    const {result} = renderUseCart();

    await waitFor(() => {
      expect(result.current.cartItemsState.status).toBe('success');
    });

    await act(async () => {
      await result.current.removeCartItem('cart-1');
    });

    expect(result.current.cartItemsState.status).toBe('error');
    expect(result.current.cartItemsState.errorMessage).toBe('장바구니 항목을 찾을 수 없습니다.');
  });
});
