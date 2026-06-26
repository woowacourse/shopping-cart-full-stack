import AppError from '../../errors/AppError.js';
import Product, { ProductType } from '../../model/Product.js';
import { ProductRepository } from './product.repository.js';

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getProducts() {
    return this.productRepository.findAll();
  }

  getProductById(id: number) {
    return this.productRepository.findById(id);
  }

  hasProduct(id: number) {
    return this.productRepository
      .findAll()
      .some((product) => product.toJson().id === id);
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    const id = this.productRepository.nextId();
    const newProduct = new Product(id, name, price, quantity, imgUrl);
    this.productRepository.add(newProduct);

    return id;
  }

  deleteProduct(id: number) {
    const exists = this.hasProduct(id);
    if (!exists) throw new AppError('PRODUCT_NOT_EXIST');

    this.productRepository.delete(id);
  }
}

export default ProductService;
