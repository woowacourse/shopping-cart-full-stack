import CartService from '../cart/cart.service.js';
import ProductService from './product.service.js';
import { ProductType } from '../../model/Product.js';

export default class ProductAppService {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  getProducts() {
    return this.productService.getProducts();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    return this.productService.addProduct({ name, price, quantity, imgUrl });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id);
    this.cartService.deleteCartItemIfExist(id);
  }
}
