import AppError from '../../errors/AppError.js';
import Product, { ProductType } from '../../model/Product.js';

class ProductService {
  private id: number;

  constructor(private productRepository: any) {
    this.id = 1;
  }

  getProducts() {
    return this.productRepository.get();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    const newProduct = new Product(this.id++, name, price, quantity, imgUrl);
    this.productRepository.add(newProduct);

    return newProduct.toJson().id;
  }

  deleteProduct(id: number) {
    const exists = this.productRepository.get().some((p: Product) => p.toJson().id === id);
    if (!exists) throw new AppError('PRODUCT_NOT_EXIST');

    this.productRepository.delete(id);
  }
}

export default ProductService;
