import { shoppingCart } from "../database/inMemoryDatabase.ts";
import { products } from "../database/inMemoryDatabase.ts";
import type { ProductId, Quantity } from "../types/type.ts";
import Product from "../domain/Product.ts";

export function addItemToCart(productId: ProductId, quantity: Quantity) {
  shoppingCart.add({ productId, quantity });
}

export function getItemsFromCart(): {
  product: Product | undefined;
  quantity: Quantity;
}[] {
  const shoppingCartArray = shoppingCart.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity }) => {
    return { product: products.get(productId), quantity: quantity };
  });
}

export function updateQuantityOfItem(productId: ProductId, quantity: Quantity) {
  shoppingCart.setQuantity(productId, quantity);
}

export function removeItemFromCart(productId: ProductId) {
  shoppingCart.removeItem(productId);
}

export function existsInCart(productId: string): boolean {
  return shoppingCart.hasProductId(productId);
}
