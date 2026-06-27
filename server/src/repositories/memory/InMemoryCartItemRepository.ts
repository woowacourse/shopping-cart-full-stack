import { CartItem } from '../../models/CartItem.js';
import type { CartItemRepository } from '../CartItemRepository.js';
import { createSeedCartItems } from './seed.js';

export class InMemoryCartItemRepository implements CartItemRepository {
  private cartItems: CartItem[];

  constructor(initial: CartItem[] = createSeedCartItems()) {
    this.cartItems = [...initial];
  }

  async findAll(): Promise<CartItem[]> {
    return [...this.cartItems];
  }

  async findById(id: string): Promise<CartItem | null> {
    return this.cartItems.find((cartItem) => cartItem.id === id) ?? null;
  }

  async updateQuantity(id: string, quantity: number): Promise<CartItem | null> {
    const cartItem = this.cartItems.find((item) => item.id === id);

    if (!cartItem) {
      return null;
    }

    cartItem.updateQuantity(quantity);
    return cartItem;
  }

  async deleteById(id: string): Promise<boolean> {
    const targetIndex = this.cartItems.findIndex((cartItem) => cartItem.id === id);

    if (targetIndex === -1) {
      return false;
    }

    this.cartItems.splice(targetIndex, 1);
    return true;
  }

  async deleteByProductId(productId: string): Promise<boolean> {
    const before = this.cartItems.length;
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.productId !== productId);
    return this.cartItems.length < before;
  }
}
