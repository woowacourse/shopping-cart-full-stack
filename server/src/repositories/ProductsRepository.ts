const products = new Map();

class ProductsRepositoryts {
  store;

  constructor() {
    this.store = products;
  }

  async getAll() {
    return this.store.entries();
  }
}

export default ProductsRepositoryts;
