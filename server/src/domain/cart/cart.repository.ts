import { cartItems } from '../../db/inMemoryDb.js';
import CartItem from '../../model/CartItem.js';

export interface CartRepository {
  get: () => CartItem[];
  add: (cartItem: CartItem) => void;
  update: (id: number, orderCount: number) => void;
  delete: (id: number) => void;
}

export class InMemoryCartRepository implements CartRepository {
  get() {
    return [...cartItems];
  }

  add(cartItem: CartItem) {
    cartItems.push(cartItem);
  }

  update(id: number, orderCount: number) {
    const index = cartItems.findIndex((c) => c.toJson().id === id);
    cartItems[index] = new CartItem(id, orderCount);
  }

  delete(id: number) {
    const index = cartItems.findIndex((c) => c.toJson().id === id);
    if (index !== -1) cartItems.splice(index, 1);
  }
}
