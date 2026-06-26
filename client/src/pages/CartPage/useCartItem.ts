import { useCallback, useEffect } from "react";
import {
  deleteCartItem,
  getCartItems,
  updateCartItemCount,
  type CartItemModel,
} from "../../domain/cart/cart.api";
import useAsyncTask, {
  type ExecuteAsyncFunctionProps,
} from "../../shared/useAsyncTask";

// 서버상태인 cartItem을 관리하는 Custom Hook
const useCartItem = (cartId: number) => {
  const {
    asyncState: getCartItemsAsyncState,
    executeAsyncFunction: executeGetCartItems,
  } = useAsyncTask<CartItemModel[]>();
  const deleteCartItemAsyncTask = useAsyncTask<void>();
  const updateCartItemCountAsyncTask = useAsyncTask<{
    id: number;
    itemCount: number;
  }>();

  const requestGetCartItems = useCallback(
    (options?: ExecuteAsyncFunctionProps<CartItemModel[]>["options"]) =>
      executeGetCartItems({
        asyncFunction: () => getCartItems(cartId),
        options,
      }),
    [executeGetCartItems, cartId],
  );

  useEffect(() => {
    void requestGetCartItems();

    // TODO: cleanup 해보기
  }, [requestGetCartItems]);

  const requestDeleteCartItem = async (
    productId: number,
    options: ExecuteAsyncFunctionProps<void>["options"],
  ) => {
    deleteCartItemAsyncTask.executeAsyncFunction({
      asyncFunction: () => deleteCartItem(cartId, productId),
      options,
    });
  };

  const requestUpdateCartItemCount = async (
    productId: number,
    itemCount: number,
    options: ExecuteAsyncFunctionProps<{
      id: number;
      itemCount: number;
    }>["options"],
  ) => {
    updateCartItemCountAsyncTask.executeAsyncFunction({
      asyncFunction: () => updateCartItemCount(cartId, productId, itemCount),
      options,
    });
  };

  return {
    requestGetCartItems,
    requestDeleteCartItem,
    requestUpdateCartItemCount,
    getCartItemsAsyncState,
    deleteCartItemAsyncState: deleteCartItemAsyncTask.asyncState,
    updateCartItemCountAsyncState: updateCartItemCountAsyncTask.asyncState,
  };
};

export default useCartItem;
