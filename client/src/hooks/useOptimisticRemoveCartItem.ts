import { useContext } from "react";
import { deleteCartItem } from "../apis/cart/cart";
import type { CartItemResponse } from "../apis/cart/cartSchema";
import { MyQueryContext } from "../lib/myQuery/MyQueryContext";
import { useMyMutation } from "../lib/myQuery/useMyMutation";
import { CART_QUERY_KEY } from "../constants/queryKeys";
import { removeItemSelectionFromStorage } from "../storage/cartSelection";

interface RemoveCartItemContext {
  deletedItem?: CartItemResponse;
}

export function useOptimisticRemoveCartItem() {
  const queryClient = useContext(MyQueryContext);
  if (!queryClient) {
    throw new Error("useOptimisticRemoveCartItem은 MyQueryProvider 안에서 사용해야 합니다.");
  }

  const { mutate } = useMyMutation<void, { id: number }, RemoveCartItemContext>(
    CART_QUERY_KEY,
    ({ id }) => deleteCartItem(id),
    {
      onMutate: ({ id }) => {
        const cartItems = queryClient.getQueryData<CartItemResponse[]>(CART_QUERY_KEY) ?? [];
        const deletedItem = cartItems.find((item) => item.id === id);

        queryClient.setQueryData<CartItemResponse[]>(CART_QUERY_KEY, (cartItems) =>
          (cartItems ?? []).filter((item) => item.id !== id),
        );

        return { deletedItem };
      },
      onError: (_error, _variables, context) => {
        const deletedItem = context?.deletedItem;
        if (!deletedItem) return;

        queryClient.setQueryData<CartItemResponse[]>(CART_QUERY_KEY, (cartItems) => [
          ...(cartItems ?? []),
          deletedItem,
        ]);
      },
      onSuccess: (_result, { id }) => {
        removeItemSelectionFromStorage(id);
      },
    },
  );

  const removeCartItem = async (id: number) => {
    try {
      await mutate({ id });
    } catch {
      // onError에서 롤백 처리됨
    }
  };

  return { removeCartItem };
}
