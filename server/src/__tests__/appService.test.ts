import AppError from '../AppError.js';
import AppService from '../AppService.js';
import Cart from '../Cart.js';
import ProductManager from '../ProductManager.js';

describe('앱 서비스 테스트', () => {
  test('상품 재고보다 더 많은 수량으로 변경 시 에러를 발생시킨다.', () => {
    // given
    const mockProducts = [
      {
        // id: 1
        name: '아디다스양말',
        price: 5000,
        imgUrl: 'https://abc.com',
        quantity: 10,
      },
      {
        // id: 2
        name: '나이키양말',
        price: 7000,
        imgUrl: 'https://abc.com',
        quantity: 20,
      },
    ];

    const productManager = new ProductManager();
    mockProducts.forEach((product) => {
      productManager.addProduct(product);
    });
    const cart = new Cart();

    const appService = new AppService(productManager, cart);
    const productId = 1;
    const orderCount = 11;

    // when & then
    expect(() => {
      appService.updateCartOrderCount(productId, orderCount);
    }).toThrow(new AppError('PRODUCT_ORDER_COUNT_EXCEEDED'));
  });

  test('상품 1개를 삭제하면, 삭제된 상품이 장바구니에서 같이 삭제된다.', () => {
    // given
    const mockProduct = {
      // id: 1
      name: '아디다스양말',
      price: 5000,
      imgUrl: 'https://abc.com',
      quantity: 10,
    };

    const productManager = new ProductManager();
    productManager.addProduct(mockProduct);
    const deleteProductId = 1;

    const cart = new Cart();
    const appService = new AppService(productManager, cart);

    // when
    appService.deleteProductWithCascade(deleteProductId);

    // then
    expect(cart.getOrderCount(deleteProductId)).toBe(undefined);
  });
});
