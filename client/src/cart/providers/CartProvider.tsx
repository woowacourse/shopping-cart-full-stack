import type {PropsWithChildren} from 'react';

import {CartContext} from '../contexts/CartContext.js';
import {useCartState} from '../hooks/useCartState.js';

export function CartProvider({children}: PropsWithChildren) {
  const cart = useCartState();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}
