import { cartReducer } from '../../../entities/cart/cartReducer';
import type { CartItem } from '../../../entities/cart/types';
import { setQueryData } from '../../../shared/hooks/useQuery';
import { useCartContext } from '../contexts/CartContext';

export function useCartSelectionActions() {
  const {
    cartItems,
    mutate,
    updateItemSelection,
    updateAllItemsSelection,
    dispatchCartAction,
  } = useCartContext();

  const changeCartItemSelection = async (id: string, checked: boolean) => {
    const currentItem = cartItems.find((item) => item.product.id === id);
    if (!currentItem) return;

    const action = { type: 'CHANGE_ITEM_SELECTION', id, checked } as const;

    try {
      dispatchCartAction(action);
      await mutate(() => updateItemSelection(id, checked), {
        onSuccess: () => {
          setQueryData<CartItem[]>('cartItems', (items) =>
            cartReducer(items, action),
          );
        },
        onError: () => {
          dispatchCartAction({
            type: 'CHANGE_ITEM_SELECTION',
            id,
            checked: currentItem.isSelected,
          });
        },
      });
    } catch {
      return;
    }
  };

  const changeAllCartItemsSelection = async (checked: boolean) => {
    const previousCartItems = cartItems;
    const action = { type: 'CHANGE_ALL_SELECTION', checked } as const;

    try {
      dispatchCartAction(action);
      await mutate(() => updateAllItemsSelection(checked), {
        onSuccess: () => {
          setQueryData<CartItem[]>('cartItems', (items) =>
            cartReducer(items, action),
          );
        },
        onError: () => {
          dispatchCartAction({ type: 'SET_ITEMS', items: previousCartItems });
        },
      });
    } catch {
      return;
    }
  };

  return {
    changeCartItemSelection,
    changeAllCartItemsSelection,
  };
}
