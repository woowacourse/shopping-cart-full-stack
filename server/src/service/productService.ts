import { products } from "../database/inMemoryDatabase.ts";
import Product from "../domain/Product.ts";
import { deleteShoppingCart } from "./shoppingCartService.ts";
import type { ProductData, ProductId } from "../types/type.ts";

export function createProduct({ name, price, image }: ProductData): Product[] {
  const product = new Product({ name, price, image });
  products.set(product.getProduct().id, product);
  return [...products.values()];
}

export function getAllProducts(): Product[] {
  return [...products.values()];
}

export function deleteProduct(id: ProductId) {
  products.delete(id);
  deleteShoppingCart(id);
}

export function existProductId(productId: string): boolean {
  return products.has(productId);
}
