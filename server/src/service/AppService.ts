import CartService from '../domain/cart/cart.service.js';
import ProductService from '../domain/product/product.service.js';
import { CartItemType } from '../model/CartItem.js';
import { ProductType } from '../model/Product.js';

export default class AppSerivce {
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
  }

  getCartItems() {
    return this.cartService.getCartItems();
  }

  addCartItem({ id, orderCount }: CartItemType) {
    return this.cartService.addCartItem({ id, orderCount });
  }

  updateCartItem({ id, orderCount }: CartItemType) {
    this.cartService.updateCartItem({ id, orderCount });
  }

  deleteCartItem(id: number) {
    this.cartService.deleteCartItem(id);
  }
}
