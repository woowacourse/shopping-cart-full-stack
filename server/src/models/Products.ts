import {Product} from './Product.js';

export class Products {
  constructor(private products: Array<Product>) {}

  getAll() {
    return [...this.products];
  }

  findById(id: string) {
    return this.products.find((product) => product.id === id);
  }

  hasName(name: string) {
    return this.products.some((product) => product.hasName(name));
  }

  add(product: Product) {
    this.products.push(product);
  }

  deleteById(id: string) {
    const targetIndex = this.products.findIndex((product) => product.id === id);

    if (targetIndex === -1) {
      return false;
    }

    this.products.splice(targetIndex, 1);
    return true;
  }

  getNextId() {
    const lastProduct = this.products.at(-1);

    if (!lastProduct) {
      return '1';
    }

    return `${Number(lastProduct.id) + 1}`;
  }
}
