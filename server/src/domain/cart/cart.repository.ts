import AppError from '../../errors/AppError.js';
import { cartItems } from '../../db/inMemoryDb.js';
import CartItem from '../../model/CartItem.js';

type CartItemFields = {
  orderCount?: number;
  isSelected?: boolean;
};

export interface CartRepository {
  findAll: () => CartItem[];
  add: (cartItem: CartItem) => void;
  update: (id: number, fields: CartItemFields) => CartItem;
  delete: (id: number) => void;
}

export class InMemoryCartRepository implements CartRepository {
  findAll() {
    return [...cartItems];
  }

  add(cartItem: CartItem) {
    cartItems.push(cartItem);
  }

  update(id: number, fields: CartItemFields) {
    const index = cartItems.findIndex((c) => c.toJson().id === id);
    if (index === -1) throw new AppError('PRODUCT_NOT_EXIST_FOR_ORDER');

    const current = cartItems[index].toJson();
    const updated = new CartItem(
      id,
      fields.orderCount ?? current.orderCount,
      fields.isSelected ?? current.isSelected,
    );
    cartItems[index] = updated;

    return updated;
  }

  delete(id: number) {
    const index = cartItems.findIndex((c) => c.toJson().id === id);
    if (index !== -1) cartItems.splice(index, 1);
  }
}
