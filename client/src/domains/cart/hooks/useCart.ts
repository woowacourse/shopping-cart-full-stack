import {useContext} from 'react';

import {CartContext} from '../contexts/CartContext.js';

export function useCart() {
  const cart = useContext(CartContext);

  if (cart === null) {
    throw new Error('useCart는 CartProvider 안에서만 사용할 수 있습니다.');
  }

  return cart;
}
