import AppError from '../../errors/AppError.js';
import CartItem, { CartItemType } from '../../model/CartItem.js';
import { CartRepository } from './cart.repository.js';

export default class CartService {
  constructor(private cartRepository: CartRepository) {}

  getCartItems() {
    return this.cartRepository.findAll();
  }

  addCartItem({ id, orderCount }: CartItemType) {
    const newCartItem = new CartItem(id++, orderCount);
    this.cartRepository.add(newCartItem);

    return newCartItem.toJson().id;
  }

  updateCartItem({
    id,
    orderCount,
    isSelected,
  }: {
    id: number;
    orderCount?: number;
    isSelected?: boolean;
  }) {
    return this.cartRepository.update(id, { orderCount, isSelected }).toJson();
  }

  deleteCartItem(id: number) {
    const exists = this.cartRepository
      .findAll()
      .some((c: CartItem) => c.toJson().id === id);
    if (!exists) throw new AppError('PRODUCT_NOT_EXIST_IN_CART');

    this.cartRepository.delete(id);
  }

  deleteCartItemIfExist(id: number) {
    const cartItems = this.getCartItems();
    const target = cartItems.find((item) => item.toJson().id === id);

    if (target) this.cartRepository.delete(id);
  }
}
