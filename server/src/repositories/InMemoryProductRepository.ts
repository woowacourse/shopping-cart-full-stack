import { ProductRepositoryInterface } from "./interfaces/ProductRepositoryInterface";
import type { ProductData, ProductInput } from "./Product";

export default class InMemoryProductRepository implements ProductRepositoryInterface {
  #products: Map<number, ProductData>;
  #nextId: number;

  constructor() {
    this.#products = new Map();
    this.#nextId = 1;
  }

  getProducts(): ProductData[] {
    return [...this.#products.values()];
  }

  findById(productId: number): ProductData | null {
    return this.#products.get(productId) ?? null;
  }

  addProduct(data: ProductInput): ProductData {
    const product = { ...data, productId: this.#nextId };
    this.#products.set(this.#nextId, product);
    this.#nextId++;
    return product;
  }

  deleteById(productId: number): void {
    this.#products.delete(productId);
  }
}
