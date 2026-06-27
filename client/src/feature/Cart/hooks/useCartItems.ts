import { useState } from 'react';
import {
  deleteCartItemApi,
  getCartItemsApi,
  patchCartItemQuantityApi,
} from '../../../api/cart/cartApi';
import type {
  CartItemResponse,
  UpdateCartItemQuantityRequest,
} from '../../../api/cart/cartApi.types';
import { useQuery } from '../../../shared/hooks/useQuery';
import { useMutation } from '../../../shared/hooks/useMutation';

export type CartFetchStatus = 'idle' | 'loading' | 'success' | 'error';

type ChangeCartItemQuantityVariables = {
  cartItemId: string;
  quantity: number;
};

export const useCartItems = () => {
  const { data, isLoading, error, refetch, setQueryData } = useQuery<
    CartItemResponse[]
  >('cart-items', getCartItemsApi);

  const {
    mutate: deleteCartItemMutate,
    isLoading: isDeleting,
    error: deleteError,
  } = useMutation<string, void>(deleteCartItemApi);

  const {
    mutate: changeCartItemQuantityMutate,
    isLoading: isChangingQuantity,
    error: changeQuantityError,
  } = useMutation<
    ChangeCartItemQuantityVariables,
    UpdateCartItemQuantityRequest
  >(({ cartItemId, quantity }) =>
    patchCartItemQuantityApi(cartItemId, {
      purchaseQuantity: quantity,
    }),
  );

  const [cartActionError, setCartActionError] = useState<Error | null>(null);

  // useQuery로 받아온 데이터
  const cartItems = data ?? [];
  const cartFetchError = error;
  const cartFetchStatus = isLoading
    ? 'loading'
    : cartFetchError
    ? 'error'
    : 'success';

  // 상품 조회, 재시도
  const loadCartItems = async () => refetch();

  // 상품 삭제
  const deleteCartItem = async (deletingCartItemId: string) => {
    setCartActionError(null);

    await deleteCartItemMutate(deletingCartItemId, {
      onSuccess: async () => {
        await refetch();
      },

      onError: () => {
        setCartActionError(deleteError);
      },
    });
  };

  // 상품 수량 변경
  const changeCartItemQuantity = async (
    cartItemId: string,
    quantity: number,
  ) => {
    const previousCartItems = data ?? [];

    await changeCartItemQuantityMutate(
      {
        cartItemId,
        quantity,
      },
      {
        onMutate: () => {
          setCartActionError(null);
          setQueryData((previousItems) =>
            previousItems.map((item) => {
              if (item.cartItemId !== cartItemId) return item;

              return {
                ...item,
                purchaseQuantity: quantity,
              };
            }),
          );
        },

        onError: () => {
          setQueryData(() => previousCartItems);
          setCartActionError(changeQuantityError);
        },
      },
    );
  };

  return {
    cartItems,
    cartFetchStatus,
    cartFetchError,
    cartActionError,
    isDeleting,
    isChangingQuantity,

    loadCartItems,
    deleteCartItem,
    changeCartItemQuantity,
  };
};
