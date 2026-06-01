import {Product} from './Product.js';
import {Products} from './Products.js';

const createProducts = () => {
  return new Products([
    new Product('1', '상품1', 1000, '/image1.png'),
    new Product('2', '상품2', 2000, '/image2.png'),
  ]);
};

describe('Products', () => {
  test('findAll은 상품 목록 복사본을 반환한다', () => {
    const products = createProducts();

    expect(products.findAll()).toHaveLength(2);
    expect(products.findAll()).not.toBe(products.findAll());
  });

  test('findById는 id에 해당하는 상품을 반환한다', () => {
    const products = createProducts();

    expect(products.findById('1')?.name).toBe('상품1');
  });

  test('findById는 없는 id이면 undefined를 반환한다', () => {
    const products = createProducts();

    expect(products.findById('999')).toBeUndefined();
  });

  test('hasName은 같은 이름의 상품이 있으면 true를 반환한다', () => {
    const products = createProducts();

    expect(products.hasName('상품1')).toBe(true);
  });

  test('hasName은 같은 이름의 상품이 없으면 false를 반환한다', () => {
    const products = createProducts();

    expect(products.hasName('없는 상품')).toBe(false);
  });

  test('add는 상품을 추가한다', () => {
    const products = createProducts();

    products.add(new Product('3', '상품3', 3000, '/image3.png'));

    expect(products.findAll()).toHaveLength(3);
  });

  test('deleteById는 상품을 삭제하고 true를 반환한다', () => {
    const products = createProducts();

    expect(products.deleteById('1')).toBe(true);
    expect(products.findById('1')).toBeUndefined();
  });

  test('deleteById는 없는 상품이면 false를 반환한다', () => {
    const products = createProducts();

    expect(products.deleteById('999')).toBe(false);
  });

  test('getNextId는 마지막 상품 id 다음 값을 문자열로 반환한다', () => {
    const products = createProducts();

    expect(products.getNextId()).toBe('3');
  });

  test('getNextId는 상품이 없으면 1을 문자열로 반환한다', () => {
    const products = new Products([]);

    expect(products.getNextId()).toBe('1');
  });
});
