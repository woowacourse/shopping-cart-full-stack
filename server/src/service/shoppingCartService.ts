import { cartRepository } from "../database/inMemoryDatabase.ts";
import { productRepository } from "../database/inMemoryDatabase.ts";
import type { ProductId, Quantity } from "../types/type.ts";
import Product from "../domain/Product.ts";
import ShoppingCart from "../domain/ShoppingCart.ts";

export function addItemToCart(productId: ProductId, quantity: Quantity) {
  const item = new ShoppingCart(productId, quantity);
  cartRepository.save(item);
}

export function getItemsFromCart(): {
  product: Product | undefined;
  quantity: Quantity;
}[] {
  const shoppingCartArray = cartRepository.getShoppingCart();
  return shoppingCartArray.map(({ productId, quantity }) => {
    return {
      product: productRepository.getProduct(productId),
      quantity: quantity,
    };
  });
}

export function updateQuantityOfItem(productId: ProductId, quantity: Quantity) {
  cartRepository.setQuantity(productId, quantity);
}

export function removeItemFromCart(productId: ProductId) {
  cartRepository.removeItem(productId);
}

export function existsInCart(productId: string): boolean {
  return cartRepository.hasProductId(productId);
}
