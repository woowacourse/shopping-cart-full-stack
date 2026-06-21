import {createContext, type PropsWithChildren} from 'react';

import {useCartState, type CartContextValue} from '../hooks/useCartState.js';

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: PropsWithChildren) {
  const cart = useCartState();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
