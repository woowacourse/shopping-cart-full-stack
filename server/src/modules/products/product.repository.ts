import type { Product } from './product.model.js';

export class ProductRepository {
  private products = new Map<string, Product>();

  save(product: Product) {
    this.products.set(product.productId, product);
    return product;
  }

  findAll() {
    return Array.from(this.products.values());
  }

  findById(productId: string) {
    return this.products.get(productId);
  }

  deleteById(productId: string) {
    return this.products.delete(productId);
  }
}
