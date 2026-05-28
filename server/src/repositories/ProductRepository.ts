import type { ProductData, ProductInput } from "./Product.ts";
import { validateProductData } from "./util/Validator.ts";

export default class ProductRepository {
  // Product의 데이터를 담고 있는 private 변수
  // Map 형태에 넣어주기 위한 index로 nextId
  #products: Map<number, ProductData>;
  #nextId: number;

  // 생성자
  // 생성자는  productId를 만들고, Product 데이터를 담은 Map을 생성한다.
  constructor() {
    this.#products = new Map();
    this.#nextId = 1;
  }

  // `getProducts()` 메서드를 통해 전체 목록을 조회가능.
  getProducts(): ProductData[] {
    return [...this.#products.values()];
  }

  // `findById()` 메서드를 통해 상품 ID로 단건 조회가능.
  findById(productId: number): ProductData | null {
    return this.#products.get(productId) ?? null;
  }

  // `addProduct()` 메서드를 통해 상품 목록을 추가가능.
  addProduct(data: ProductInput): ProductData {
    validateProductData(data);
    const product = { ...data, productId: this.#nextId };
    this.#products.set(this.#nextId, product);
    this.#nextId++;
    return product;
  }

  // `deleteById()` 메서드를 통해 상품 목록에서 제거가능.
  deleteById(productId: number): void {
    this.#products.delete(productId);
  }

    clear(): void {
    this.#products.clear();
    this.#nextId = 1;
  }
}

export const productRepository = new ProductRepository();
