import AppError from '../../errors/AppError.js';
import CartItem, { CartItemType } from '../../model/CartItem.js';
import { CartRepository } from './cart.repository.js';

export default class CartService {
  constructor(private cartRepository: CartRepository) {}

  getCartItems() {
    return this.cartRepository.get();
  }

  addCartItem({ id, orderCount }: CartItemType) {
    const newCartItem = new CartItem(id++, orderCount);
    this.cartRepository.add(newCartItem);

    return newCartItem.toJson().id;
  }

  updateCartItem({ id, orderCount }: CartItemType) {
    this.cartRepository.update(id, orderCount);
  }

  deleteCartItem(id: number) {
    const exists = this.cartRepository
      .get()
      .some((c: CartItem) => c.toJson().id === id);
    if (!exists) throw new AppError('PRODUCT_NOT_EXIST_IN_CART');

    this.cartRepository.delete(id);
  }
}
