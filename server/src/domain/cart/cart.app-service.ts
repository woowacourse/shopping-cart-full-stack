import CartService from './cart.service.js';
import ProductService from '../product/product.service.js';
import {
  calculateOrderPrice,
  calculateShippingFee,
} from '../payment/payment.calculator.js';
import AppError from '../../errors/AppError.js';
import { CartItemType } from '../../model/CartItem.js';

export default class CartAppService {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  private getCartItemsWithProduct() {
    return this.cartService.getCartItems().map((item) => {
      const { id, orderCount, isSelected } = item.toJson();
      const { name, price, imgUrl } = this.productService
        .getProductById(id)
        .toJson();

      return { id, name, price, imgUrl, orderCount, isSelected };
    });
  }

  getCartItems() {
    return this.getCartItemsWithProduct();
  }

  getCartPayment() {
    const selectedItems = this.getCartItemsWithProduct().filter(
      (item) => item.isSelected,
    );

    const orderPrice = calculateOrderPrice(selectedItems);
    const shippingFee = calculateShippingFee(orderPrice);

    return { orderPrice, shippingFee, totalPrice: orderPrice + shippingFee };
  }

  addCartItem({ id, orderCount }: CartItemType) {
    return this.cartService.addCartItem({ id, orderCount });
  }

  updateCartItem({
    id,
    orderCount,
    isSelected,
  }: {
    id: number;
    orderCount?: number;
    isSelected?: boolean;
  }) {
    if (orderCount !== undefined) {
      const product = this.productService.getProductById(id);
      if (product.toJson().quantity < orderCount) {
        throw new AppError('PRODUCT_ORDER_COUNT_EXCEEDED');
      }
    }

    return this.cartService.updateCartItem({ id, orderCount, isSelected });
  }

  deleteCartItem(id: number) {
    this.cartService.deleteCartItem(id);
  }
}
