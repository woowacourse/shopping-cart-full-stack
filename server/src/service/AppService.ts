import ProductService from '../domain/product/product.service.js';
import { ProductType } from '../model/Product.js';

export default class AppSerivce {
  constructor(
    private productService: ProductService,
    // private privateCartService: any,
  ) {}

  getProducts() {
    return this.productService.getProducts();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    this.productService.addProduct({ name, price, quantity, imgUrl });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id);
  }
}
