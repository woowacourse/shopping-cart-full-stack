import {Product} from './Product.js';

describe('Product', () => {
  test('hasName은 이름이 같으면 true를 반환한다', () => {
    const product = new Product('1', '상품', 1000, '/image.png');

    expect(product.hasName('상품')).toBe(true);
  });

  test('hasName은 이름이 다르면 false를 반환한다', () => {
    const product = new Product('1', '상품', 1000, '/image.png');

    expect(product.hasName('다른 상품')).toBe(false);
  });
});
