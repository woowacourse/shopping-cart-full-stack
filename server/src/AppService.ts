import AppError from './AppError.js';
import Cart from './Cart.js';
import ProductManager from './ProductManager.js';

class AppService {
  constructor(
    private productManager: ProductManager,
    private cart: Cart,
  ) {
    this.productManager = productManager;
    this.cart = cart;
  }

  updateCartOrderCount(id: number, orderCount: number) {
    const products = this.productManager.getProducts();
    const targetProduct = products.find((product) => product.id === id);

    if (!targetProduct) {
      // TODO: 에러 엔드포인트 및 메시지 정의 필요
      throw new Error('찾으시는 상품이 존재하지 않습니다.');
    }

    if (targetProduct.quantity < orderCount) {
      throw new AppError('PRODUCT_ORDER_COUNT_EXCEEDED');
    }

    this.cart.setOrderCount(id, orderCount);
  }

  deleteProductWithCascade(id: number) {
    this.productManager.deleteProduct(id);
    this.cart.deleteCartItem(id);
  }
}

export default AppService;
