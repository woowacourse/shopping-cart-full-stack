import { NotFoundError } from '../errors';
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

  async deleteProduct(productId: Product['productId']) {
    const product = await this.repository.getById(productId);
    // TODO: 상품 삭제시 해당 상품을 담아놓은 장바구니에서 제거해줘야함
    if (!product) throw new NotFoundError('삭제할 상품');
    return await this.repository.deleteById(productId);
  }
}

export default ProductsService;
