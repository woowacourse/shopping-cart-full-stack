import { useEffect, useRef, useState } from 'react';
import type { CartItemResponse } from '../../apis/cart';
import type { SelectionStorage } from '../../repositories/SelectionStorage';

export const useCartSelection = (
  cartItems: CartItemResponse[],
  selectionStorage: SelectionStorage,
) => {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const isInitialized = useRef(false);

  const productIds = cartItems.map((item) => item.product.id);

  const updateSelectedProductIds = (nextSelectedProductIds: string[]) => {
    setSelectedProductIds(nextSelectedProductIds);
    selectionStorage.setIds(nextSelectedProductIds);
  };

  useEffect(() => {
    if (isInitialized.current || productIds.length === 0) return;
    isInitialized.current = true;

    const saved = selectionStorage.getIds();

    updateSelectedProductIds(saved === null ? productIds : saved);
  }, [productIds]);

  const isAllSelected =
    cartItems.length > 0 && selectedProductIds.length === cartItems.length;

  const toggleItem = (productId: string) => {
    updateSelectedProductIds(
      selectedProductIds.includes(productId)
        ? selectedProductIds.filter((id) => id !== productId)
        : [...selectedProductIds, productId],
    );
  };

  const toggleAll = () => {
    const nextSelectedIds = isAllSelected ? [] : productIds;

    updateSelectedProductIds(nextSelectedIds);
  };

  const deselectItem = (productId: string) => {
    updateSelectedProductIds(
      selectedProductIds.filter((id) => id !== productId),
    );
  };

  return {
    selectedProductIds,
    isAllSelected,
    toggleItem,
    toggleAll,
    deselectItem,
  };
};
