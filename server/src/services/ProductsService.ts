import ProductsRepository from '../repositories/ProductsRepository';

class ProductsService {
  repository;

  constructor() {
    this.repository = new ProductsRepository();
  }

  async getProducts() {
    return await this.repository.getAll();
  }
}

export default ProductsService;
