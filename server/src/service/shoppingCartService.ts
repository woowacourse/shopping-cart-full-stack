import { shoppingCart } from '../database/inMemoryDatabase.ts';
import { products } from '../database/inMemoryDatabase.ts';

export function createShoppingCart(productId: string, quantity: number) {
  shoppingCart.add({ productId, quantity });
}

export function getShoppingCart() {
  const shoppingCartArray = shoppingCart.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity }) => {
    return { product: products.get(productId), quantity: quantity };
  });
}

export function patchShoppingCart(productId: string, quantity: number) {
  shoppingCart.setQuantity(productId, quantity);
}

export function deleteShoppingCart(productId: string) {
  shoppingCart.deleteProduct(productId);
}
