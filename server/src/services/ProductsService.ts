import ProductsRepository from '../repositories/ProductsRepository';
import { Product } from '../types';

class ProductsService {
  repository;

  constructor() {
    this.repository = new ProductsRepository();
  }

  async getProducts() {
    const products = await this.repository.getAll();

    return products.filter((product) => product.isDeleted === false);
  }

  async insertProduct(product: Omit<Product, 'productId' | 'isDeleted'>) {
    // TODO: 도메인 검증
    return await this.repository.insert(product);
  }
}

export default ProductsService;
