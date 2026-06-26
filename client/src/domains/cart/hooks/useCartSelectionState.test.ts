import {act, renderHook, waitFor} from '@testing-library/react';

import {useCartSelectionState} from './useCartSelectionState.js';
import type {CartItem} from '../domain/types.js';

const SELECTED_CART_ITEM_IDS_STORAGE_KEY = 'shopping-cart-selected-cart-item-ids';

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

describe('useCartSelectionState', () => {
  test('저장된 선택 상태가 없으면 전체 선택한다', async () => {
    const {result} = renderHook(() => useCartSelectionState());

    act(() => {
      result.current.initializeSelectedCartItemIds(cartItems);
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual(['cart-1', 'cart-2']);
    });
  });

  test('저장된 빈 선택 상태가 있으면 전체 해제 상태를 유지한다', async () => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY, JSON.stringify([]));

    const {result} = renderHook(() => useCartSelectionState());

    act(() => {
      result.current.initializeSelectedCartItemIds(cartItems);
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual([]);
    });
  });

  test('저장된 선택 id 중 현재 장바구니에 없는 id는 제외한다', async () => {
    localStorage.setItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY, JSON.stringify(['cart-2', 'cart-999']));

    const {result} = renderHook(() => useCartSelectionState());

    act(() => {
      result.current.initializeSelectedCartItemIds(cartItems);
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual(['cart-2']);
    });
  });

  test('선택 id 목록을 변경하고 저장한다', async () => {
    const {result} = renderHook(() => useCartSelectionState());

    act(() => {
      result.current.initializeSelectedCartItemIds(cartItems);
      result.current.changeSelectedCartItemIds(['cart-2']);
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual(['cart-2']);
    });

    expect(localStorage.getItem(SELECTED_CART_ITEM_IDS_STORAGE_KEY)).toBe(JSON.stringify(['cart-2']));
  });

  test('삭제된 장바구니 항목 id를 선택 목록에서 제거한다', async () => {
    const {result} = renderHook(() => useCartSelectionState());

    act(() => {
      result.current.initializeSelectedCartItemIds(cartItems);
      result.current.removeSelectedCartItemId('cart-1');
    });

    await waitFor(() => {
      expect(result.current.selectedIds).toEqual(['cart-2']);
    });
  });
});
