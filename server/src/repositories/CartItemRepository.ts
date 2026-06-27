import type { CartItem } from '../models/CartItem.js';

export interface CartItemRepository {
  findAll(): Promise<CartItem[]>;
  findById(id: string): Promise<CartItem | null>;
  updateQuantity(id: string, quantity: number): Promise<CartItem | null>;
  deleteById(id: string): Promise<boolean>;
  deleteByProductId(productId: string): Promise<boolean>;
}
