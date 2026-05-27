import { Product } from './../types';

const products = new Map<string, Product>();

class ProductsRepository {
  store;

  constructor() {
    this.store = products;
  }

  async getAll() {
    return Array.from(this.store.entries()).map((entry) => entry[1]);
  }

  async insert(product: Omit<Product, 'productId' | 'isDeleted'>) {
    const productObj = {
      isDeleted: false,
      productId: products.size.toString(),
      ...product,
    };

    products.set(productObj.productId, productObj);
    return productObj;
  }
  async getById(productId: Product['productId']) {
    return this.store.get(productId);
  }
  async deleteById(productId: Product['productId']) {
    return this.store.delete(productId);
  }
}

export default ProductsRepository;
