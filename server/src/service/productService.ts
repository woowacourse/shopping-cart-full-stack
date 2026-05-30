import { products } from "../database/inMemoryDatabase.ts";
import Product from "../domain/Product.ts";
import type { ProductData, ProductId } from "../types/type.ts";

export function addProductToList({ name, price, image }: ProductData) {
  const product = new Product({ name, price, image });
  products.set(product.getProduct().id, product);
}

export function getAllProducts(): Product[] {
  return [...products.values()];
}

export function removeProductFromList(id: ProductId) {
  products.delete(id);
}

export function existsProductId(productId: string): boolean {
  return products.has(productId);
}
