import Product from "../domain/Product.ts";
import type { ProductId } from "../types/type.ts";

export class ProductRepository {
  private products = new Map<ProductId, Product>();

  save(productId: string, product: Product) {
    this.products.set(productId, product);
  }

  getProduct(productId: ProductId) {
    return this.products.get(productId);
  }

  getAllProducts() {
    return [...this.products.values()];
  }

  remove(productId: string) {
    this.products.delete(productId);
  }

  hasId(productId: string) {
    return this.products.has(productId);
  }

  clear() {
    this.products.clear();
  }
}
