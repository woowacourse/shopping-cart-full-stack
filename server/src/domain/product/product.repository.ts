import Product, { ProductType } from "../../model/Product.js";

export interface ProductRepository {
  add: (product: Product) => void;
  delete: (id: number) => void;
  get: () => void;
  nextId: () => number;
  reset: () => void;
  findById: (id: number) => ProductType | undefined;
  // TOOD: 반환 타입 수정
}

export class InMemoryProductRepository implements ProductRepository {
  private products: Array<Product>;
  private id: number;

  constructor() {
    this.products = [];
    this.id = 1;
  }

  add(newProduct: Product) {
    this.products.push(newProduct);
    this.id++;
  }

  delete() {}

  get() {
    return this.products.map((product) => product.toJson());
  }

  nextId() {
    return this.id;
  }

  reset() {
    this.products = [];
    this.id = 1;
  }

  findById(id: number) {
    const findProduct = this.products.find(
      (product) => product.toJson().id === id,
    );
    if (!findProduct) {
      return undefined;
    }
    return findProduct.toJson();
  }
}
