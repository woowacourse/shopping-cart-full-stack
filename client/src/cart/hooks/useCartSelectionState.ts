import {useCallback, useEffect, useState} from 'react';

import {loadSelectedCartItemIds, saveSelectedCartItemIds} from '../domain/selectionStorage.js';
import type {CartItem, CartItemId, CartSelectionState} from '../domain/types.js';

export function useCartSelectionState() {
  const [selectionState, setSelectionState] = useState<CartSelectionState>({selectedIds: []});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;

    saveSelectedCartItemIds(selectionState.selectedIds);
  }, [isInitialized, selectionState.selectedIds]);

  const initializeSelectedCartItemIds = useCallback((cartItems: CartItem[]) => {
    const selectedIds = createInitialSelectedCartItemIds(cartItems);

    setSelectionState({selectedIds});
    setIsInitialized(true);
  }, []);

  const changeSelectedCartItemIds = useCallback((selectedIds: CartItemId[]) => {
    setSelectionState({selectedIds});
  }, []);

  const removeSelectedCartItemId = useCallback((cartItemId: CartItemId) => {
    setSelectionState(({selectedIds}) => {
      return {
        selectedIds: selectedIds.filter((selectedCartItemId) => selectedCartItemId !== cartItemId),
      };
    });
  }, []);

  return {
    selectedIds: selectionState.selectedIds,
    initializeSelectedCartItemIds,
    changeSelectedCartItemIds,
    removeSelectedCartItemId,
  };
}

function createInitialSelectedCartItemIds(cartItems: CartItem[]) {
  const savedSelectedCartItemIds = loadSelectedCartItemIds();
  const currentCartItemIds = cartItems.map((cartItem) => cartItem.id);

  if (savedSelectedCartItemIds === null) {
    return currentCartItemIds;
  }

  return savedSelectedCartItemIds.filter((selectedCartItemId) => currentCartItemIds.includes(selectedCartItemId));
}
