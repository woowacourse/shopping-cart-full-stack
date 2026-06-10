import {createContext, createElement, useContext} from 'react';
import type {PropsWithChildren} from 'react';

import {useCartState, type CartContextValue} from './useCartState.js';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({children}: PropsWithChildren) {
  const cart = useCartState();

  return createElement(CartContext.Provider, {value: cart}, children);
}

export function useCart() {
  const cart = useContext(CartContext);

  if (cart === null) {
    throw new Error('useCart는 CartProvider 안에서만 사용할 수 있습니다.');
  }

  return cart;
}
