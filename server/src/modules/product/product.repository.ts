import Product from "./Product.js";

export interface ProductRepository {
  add: (product: Product) => void;
  delete: (id: number) => void;
  get: () => Product[];
  nextId: () => number;
  reset: () => void;
  findById: (id: number) => Product | undefined;
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

  delete(id: number) {
    this.products = this.products.filter((product) => !product.isSameId(id));
  }

  get() {
    return [...this.products];
  }

  nextId() {
    return this.id;
  }

  reset() {
    this.products = [];
    this.id = 1;
  }

  findById(id: number) {
    return this.products.find((product) => product.isSameId(id));
  }
}
