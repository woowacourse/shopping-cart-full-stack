import {createContext} from 'react';

import type {CartContextValue} from '../hooks/useCartState.js';

export const CartContext = createContext<CartContextValue | null>(null);
