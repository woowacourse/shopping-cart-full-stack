import { createContext, useContext } from 'react';

import type { CartAction } from '../../../entities/cart/cartReducer';
import type { CartItem } from '../../../entities/cart/types';
import type { Mutate } from '../../../shared/hooks/useMutation';

export type CartContextValue = {
  cartItems: CartItem[];
  isPending: boolean;
  error: Error | null;
  mutationError: Error | null;
  isMutationLoading: boolean;
  mutate: Mutate;
  updateItemQuantity: (id: string, quantity: number) => Promise<void>;
  updateItemSelection: (id: string, isSelected: boolean) => Promise<void>;
  updateAllItemsSelection: (isSelected: boolean) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  dispatchCartAction: (action: CartAction) => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartContext는 CartProvider 안에서 사용해야 합니다.');
  }

  return context;
}
