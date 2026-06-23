import { cartReducer } from '../../../entities/cart/cartReducer';
import {
  MAX_CART_ITEM_QUANTITY,
  MIN_CART_ITEM_QUANTITY,
} from '../../../entities/cart/constants';
import type { CartItem } from '../../../entities/cart/types';
import { setQueryData } from '../../../shared/hooks/useQuery';
import { useCartContext } from '../contexts/CartContext';

export function useCartQuantityActions() {
  const {
    cartItems,
    isMutationLoading,
    mutate,
    updateItemQuantity,
    dispatchCartAction,
  } = useCartContext();

  const findCartItem = (id: string) => {
    return cartItems.find((item) => item.product.id === id);
  };

  const changeQuantity = async (id: string, nextQuantity: number) => {
    const currentItem = findCartItem(id);
    if (!currentItem) return;

    if (isMutationLoading) return;

    try {
      dispatchCartAction({
        type: 'CHANGE_QUANTITY',
        id,
        quantity: nextQuantity,
      });
      await mutate(() => updateItemQuantity(id, nextQuantity), {
        onSuccess: () => {
          setQueryData<CartItem[]>('cartItems', (items) =>
            cartReducer(items, {
              type: 'CHANGE_QUANTITY',
              id,
              quantity: nextQuantity,
            }),
          );
        },
        onError: () => {
          dispatchCartAction({
            type: 'CHANGE_QUANTITY',
            id,
            quantity: currentItem.quantity,
          });
        },
      });
    } catch {
      return;
    }
  };

  const increaseQuantity = async (id: string) => {
    const currentItem = findCartItem(id);
    if (!currentItem) return;

    const nextQuantity = Math.min(
      MAX_CART_ITEM_QUANTITY,
      currentItem.quantity + 1,
    );

    await changeQuantity(id, nextQuantity);
  };

  const decreaseQuantity = async (id: string) => {
    const currentItem = findCartItem(id);
    if (!currentItem) return;

    const nextQuantity = Math.max(
      MIN_CART_ITEM_QUANTITY,
      currentItem.quantity - 1,
    );

    await changeQuantity(id, nextQuantity);
  };

  return {
    increaseQuantity,
    decreaseQuantity,
  };
}
