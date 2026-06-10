import {useCallback, useEffect, useReducer} from 'react';

import {deleteCartItem, getCartItems, updateCartItemQuantity} from '../api/cartApi.js';
import {cartItemsReducer} from '../domain/cartReducer.js';
import type {CartItem, CartItemId, CartItemsState} from '../domain/types.js';
import {useCartSelectionState} from './useCartSelectionState.js';

const initialCartItemsState: CartItemsState = {
  status: 'loading',
  items: [],
  errorMessage: '',
};

export type CartContextValue = {
  cartItemsState: CartItemsState;
  selectedIds: CartItemId[];
  loadCartItems: () => Promise<void>;
  changeSelectedCartItemIds: (selectedIds: CartItemId[]) => void;
  changeCartItemQuantity: (cartItemId: CartItemId, quantity: CartItem['quantity']) => Promise<void>;
  removeCartItem: (cartItemId: CartItemId) => Promise<void>;
};

export function useCartState(): CartContextValue {
  const [cartItemsState, dispatch] = useReducer(cartItemsReducer, initialCartItemsState);
  const {changeSelectedCartItemIds, initializeSelectedCartItemIds, removeSelectedCartItemId, selectedIds} =
    useCartSelectionState();

  const loadCartItems = useCallback(async () => {
    dispatch({type: 'fetchStart'});

    try {
      const cartItems = await getCartItems();

      dispatch({type: 'fetchSuccess', payload: {items: cartItems}});
      initializeSelectedCartItemIds(cartItems);
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, [initializeSelectedCartItemIds]);

  useEffect(() => {
    void loadCartItems();
  }, [loadCartItems]);

  const changeCartItemQuantity = useCallback(async (cartItemId: CartItemId, quantity: CartItem['quantity']) => {
    try {
      const updatedCartItem = await updateCartItemQuantity(cartItemId, quantity);

      dispatch({
        type: 'updateCartItemQuantity',
        payload: {
          cartItemId: updatedCartItem.id,
          quantity: updatedCartItem.quantity,
        },
      });
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, []);

  const removeCartItem = useCallback(async (cartItemId: CartItemId) => {
    try {
      await deleteCartItem(cartItemId);

      dispatch({type: 'deleteCartItem', payload: {cartItemId}});
      removeSelectedCartItemId(cartItemId);
    } catch (error) {
      dispatch({type: 'fetchError', payload: {errorMessage: getCartErrorMessage(error)}});
    }
  }, [removeSelectedCartItemId]);

  return {
    cartItemsState,
    selectedIds,
    loadCartItems,
    changeSelectedCartItemIds,
    changeCartItemQuantity,
    removeCartItem,
  };
}

function getCartErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '장바구니를 불러오지 못했습니다.';
}
