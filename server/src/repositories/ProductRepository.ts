import type { ProductData, ProductInput } from "./Product";
import { validateProductData } from "./util/Validator";

export default class ProductRepository {
  // Product의 데이터를 담고 있는 private 변수
  // Map 형태에 넣어주기 위한 index로 nextId
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
    validateProductData(data);
    const product = { ...data, productId: this.#nextId };
    this.#products.set(this.#nextId, product);
    this.#nextId++;
    return product;
  }

  deleteById(productId: number): void {
    this.#products.delete(productId);
  }

  clear(): void {
    this.#products.clear();
    this.#nextId = 1;
  }
}

export const productRepository = new ProductRepository();
