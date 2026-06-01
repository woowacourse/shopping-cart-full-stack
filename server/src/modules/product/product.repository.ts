import Product, { ProductType } from "./Product.js";

export interface ProductRepository {
  add: ({ name, price, quantity, imgUrl }: Omit<ProductType, "id">) => Product;
  delete: (id: number) => void;
  get: () => Product[];
  findById: (id: number) => Product | undefined;
}

export class InMemoryProductRepository implements ProductRepository {
  private products: Array<Product>;
  private id: number;

  constructor() {
    this.products = [];
    this.id = 1;
  }

  add({ name, price, quantity, imgUrl }: Omit<ProductType, "id">) {
    const newProduct = new Product(this.id, name, price, quantity, imgUrl);
    this.products.push(newProduct);
    this.id++;

    return newProduct;
  }

  delete(id: number) {
    this.products = this.products.filter((product) => !product.isSameId(id));
  }

  get() {
    return [...this.products];
  }

  findById(id: number) {
    return this.products.find((product) => product.isSameId(id));
  }
}
