//서비스와 레포지를 이용해서 기능을 도작하게 한다

import { productsDB } from '../../../src/db.js';
import { productRepository } from '../../../src/modules/products/product.repository.js';
import { productService } from '../../../src/modules/products/product.service.js';

describe('ProductService', () => {
  beforeEach(() => {
    productsDB.clear();
  });

  // 상품을 조회하는 기능
  test('상품 조회 기능 테스트', () => {
    // given
    const productA = productService.addProduct({
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    });

    const productB = productService.addProduct({
      productName: '사이다',
      productPrice: 1500,
      remainingQuantity: 10,
      imageUrl: 'src/assets/cider.png',
    });

    // when
    const products = productService.getProducts();

    // then
    expect(products).toHaveLength(2);
    expect(products[0].productId).toBe(productA.productId);
    expect(products[1].productId).toBe(productB.productId);
  });

  // 상품을 추가하는 기능
  test('상품 추가 기능 테스트', () => {
    // given
    const response = productService.addProduct({
      productName: '콜라',
      productPrice: 1300,
      remainingQuantity: 25,
      imageUrl: 'src/assets/coke.png',
    });

    // when
    const products = productService.getProducts();

    // then
    expect(products).toHaveLength(1);
    expect(products[0].productId).toBe(response.productId);
  });

  // 상품을 삭제하는 기능
  describe('상품 삭제 기능 테스트', () => {
    test('상품을 삭제할 수 있다.', () => {
      // given
      const response = productService.addProduct({
        productName: '콜라',
        productPrice: 1300,
        remainingQuantity: 25,
        imageUrl: 'src/assets/coke.png',
      });

      productService.deleteProduct(response.productId);

      // when
      const products = productService.getProducts();

      // then
      expect(products).toHaveLength(0);
    });

    test('존재하지 않은 상품 삭제 시 에러를 반환한다.', () => {
      expect(() => {
        productService.deleteProduct('1');
      }).toThrow('존재하지 않는 상품입니다.');
    });
  });
});
