import { cartReducer } from '../../../entities/cart/cartReducer';
import type { CartItem } from '../../../entities/cart/types';
import { setQueryData } from '../../../shared/hooks/useQuery';
import { useCartContext } from '../contexts/CartContext';

export function useCartItemActions() {
  const { cartItems, mutate, removeItem, dispatchCartAction } =
    useCartContext();

  const removeCartItem = async (id: string) => {
    const currentItem = cartItems.find((item) => item.product.id === id);
    if (!currentItem) return;

    try {
      await mutate(() => removeItem(id), {
        onSuccess: () => {
          dispatchCartAction({ type: 'REMOVE_ITEM', id });

          setQueryData<CartItem[]>('cartItems', (items) =>
            cartReducer(items, {
              type: 'REMOVE_ITEM',
              id,
            }),
          );
        },
      });
    } catch {
      return;
    }
  };

  return {
    removeCartItem,
  };
}
