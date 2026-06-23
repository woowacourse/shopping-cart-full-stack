import { useEffect, useReducer, type ReactNode } from 'react';

import { cartReducer, type CartAction } from '../../../entities/cart/cartReducer';
import type { CartItem } from '../../../entities/cart/types';
import { useMutation } from '../../../shared/hooks/useMutation';
import { useQuery } from '../../../shared/hooks/useQuery';
import { CartContext } from '../contexts/CartContext';

type CartProviderProps = {
  children: ReactNode;
  fetchItems: () => Promise<CartItem[]>;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  updateItemSelection: (id: string, isSelected: boolean) => Promise<void>;
  updateAllItemsSelection: (isSelected: boolean) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
};

export default function CartProvider({
  children,
  fetchItems,
  updateItemQuantity,
  updateItemSelection,
  updateAllItemsSelection,
  removeItem,
}: CartProviderProps) {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  const {
    data: fetchedCartItems,
    isPending,
    error,
  } = useQuery('cartItems', fetchItems);

  const {
    mutate,
    isPending: isMutationLoading,
    error: mutationError,
  } = useMutation();

  const dispatchCartAction = (action: CartAction) => {
    dispatch(action);
  };

  useEffect(() => {
    if (!fetchedCartItems) return;

    dispatch({
      type: 'SET_ITEMS',
      items: fetchedCartItems,
    });
  }, [fetchedCartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isPending,
        error,
        mutationError,
        isMutationLoading,
        mutate,
        updateItemQuantity,
        updateItemSelection,
        updateAllItemsSelection,
        removeItem,
        dispatchCartAction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
