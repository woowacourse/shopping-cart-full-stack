import { useEffect, useReducer, useRef } from "react";
import type { AsyncState } from "../../shared/useAsyncTask";
import type { CartItemModel } from "../../domain/cart/cart.api";

// localStorage, 클라이언트 상태 총 2곳에서 관리되는 selectedProductIds를 동기화하고 관리하는 훅
export const useCartItemSelection = (
  cartItemsAsyncState: AsyncState<CartItemModel[]>,
) => {
  const [selectedProductIds, selectedProductIdsDispatch] = useReducer(
    selectedProductIdsReducer,
    [],
  );
  // 최초 렌더링 시 상품 전체선택으로 1번 바뀌었다는 것을 나타내는 flag
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (cartItemsAsyncState.status !== "success" || isInitializedRef.current) {
      return;
    }
    const cartItems = cartItemsAsyncState.data;

    const savedCartItemSelection = localStorage.getItem(
      "cart-selected-product-ids",
    );

    if (!savedCartItemSelection) {
      const allProductIds = cartItems.map((cartItem) => cartItem.productId);

      selectedProductIdsDispatch({
        type: "insertAll",
        productIds: allProductIds,
      });
    } else {
      const parsedCartItemSelection = JSON.parse(
        savedCartItemSelection,
      ) as number[];

      selectedProductIdsDispatch({
        type: "insertAll",
        productIds: parsedCartItemSelection,
      });
    }

    isInitializedRef.current = true;
  }, [cartItemsAsyncState]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    localStorage.setItem(
      "cart-selected-product-ids",
      JSON.stringify(selectedProductIds),
    );
  }, [selectedProductIds]);

  const clearCartItemSelection = () => {
    selectedProductIdsDispatch({ type: "init" });
  };

  const selectCartItem = (productId: number) => {
    selectedProductIdsDispatch({
      type: "insert",
      productId,
    });
  };

  const selectAllCartItems = (productIds: number[]) => {
    selectedProductIdsDispatch({
      type: "insertAll",
      productIds,
    });
  };

  const unselectCartItem = (productId: number) => {
    selectedProductIdsDispatch({
      type: "remove",
      productId,
    });
  };

  return {
    selectedProductIds,
    clearCartItemSelection,
    selectCartItem,
    selectAllCartItems,
    unselectCartItem,
  };
};

export type CartItemSelectionReducerAction =
  | { type: "init" }
  | { type: "insert"; productId: number }
  | { type: "insertAll"; productIds: number[] }
  | { type: "remove"; productId: number };

export const selectedProductIdsReducer = (
  productIds: number[],
  action: CartItemSelectionReducerAction,
) => {
  switch (action.type) {
    case "init": {
      return [];
    }
    case "insert": {
      return Array.from(new Set([...productIds, action.productId]));
    }

    case "insertAll": {
      return Array.from(new Set([...productIds, ...action.productIds]));
    }
    case "remove": {
      return productIds.filter((id) => id !== action.productId);
    }
    default: {
      return productIds;
    }
  }
};
