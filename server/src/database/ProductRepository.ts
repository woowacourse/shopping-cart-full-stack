import Product from "../domain/Product.ts";
import type { ProductId } from "../types/type.ts";

export class ProductRepository {
  private products = new Map<ProductId, Product>();

  save(productId: string, product: Product) {
    this.products.set(productId, product);
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
}
