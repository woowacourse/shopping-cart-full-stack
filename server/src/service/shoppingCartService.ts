import { shoppingCart } from "../database/inMemoryDatabase.ts";
import { products } from "../database/inMemoryDatabase.ts";
import type { ProductId, Quantity } from "../types/type.ts";
import Product from "../domain/Product.ts";

export function createShoppingCart(productId: ProductId, quantity: Quantity) {
  shoppingCart.add({ productId, quantity });
}

export function getShoppingCart(): {
  product: Product | undefined;
  quantity: Quantity;
}[] {
  const shoppingCartArray = shoppingCart.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity }) => {
    return { product: products.get(productId), quantity: quantity };
  });
}

export function patchShoppingCart(productId: ProductId, quantity: Quantity) {
  shoppingCart.setQuantity(productId, quantity);
}

export function deleteShoppingCart(productId: ProductId) {
  shoppingCart.deleteProduct(productId);
}

export function existShoppingCartProductId(productId: string): boolean {
  return shoppingCart.hasProductId(productId);
}
