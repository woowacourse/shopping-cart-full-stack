import type { CartItem } from "../../domain/Types";

export interface CartApiInterface {
  getCartItems(): Promise<CartItem[]>;
  updateCartItemQuantity(cartItemId: number, quantity: number): Promise<CartItem>;
  deleteCartItem(cartItemId: number): Promise<void>;
}
