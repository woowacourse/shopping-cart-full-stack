import { shoppingCart } from '../database/inMemoryDatabase.ts';

export function createShoppingCart(productId: string, quantity: number) {
  shoppingCart.add({ productId, quantity });
}

export function getShoppingCart() {
  return shoppingCart.getShoppingCart();
}

export function patchShoppingCart(productId: string, quantity: number) {
  shoppingCart.setQuantity(productId, quantity);
}

export function deleteShoppingCart(productId: string) {
  shoppingCart.deleteProduct(productId);
}
