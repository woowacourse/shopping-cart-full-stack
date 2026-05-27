import ProductManager, { ProductCreateDTO } from '../ProductManager.js';

const mockProduct: ProductCreateDTO = {
  name: '아디다스양말',
  price: 5000,
  imgUrl: 'https://abc.com',
  quantity: 10,
};

describe('상품 추가 기능 테스트', () => {
  test('상품 1개를 추가하면, 해당 상품이 상품 목록에 추가된다.', () => {
    // given
    const productManager = new ProductManager();

    // when
    productManager.addProduct(mockProduct);

    // then
    expect(
      productManager
        .getProducts()
        .find((product) => product.name === mockProduct.name),
    ).not.toBe(undefined);
  });
});

describe('상품 추가 예외 테스트', () => {
  // given
  let productManager: ProductManager;

  beforeEach(() => {
    productManager = new ProductManager();
  });

  test('상품명이 100자를 초과하면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        name: '아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말',
      });
    }).toThrow('상품명은 100자를 초과할 수 없습니다.');
  });

  test('가격이 숫자가 아니면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        // @ts-ignore 예외 처리를 위한 타입 무시
        price: 'abc',
      });
    }).toThrow('가격은 0보다 큰 숫자여야 합니다.');
  });

  test('가격이 0 이하이면 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        price: 0,
      });
    }).toThrow('가격은 0보다 큰 숫자여야 합니다.');
  });

  test('재고 수량이 범위(1~99)를 벗어날 경우 에러를 발생시킨다.', () => {
    // when & then
    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        quantity: 0,
      });
    }).toThrow('상품 재고는 1이상 99이하의 정수이어야 합니다.');

    expect(() => {
      productManager.addProduct({
        ...mockProduct,
        quantity: 100,
      });
    }).toThrow('상품 재고는 1이상 99이하의 정수이어야 합니다.');
  });
});
