import ProductManager, { ProductCreateDTO } from '../ProductManager.js';

describe('상품 추가 기능 테스트', () => {
  test('상품 1개를 추가하면, 해당 상품이 상품 목록에 추가된다.', () => {
    // given
    const productManager = new ProductManager();
    const mockProduct: ProductCreateDTO = {
      name: '아디다스 양말',
      price: 5000,
      imgUrl: 'https://abc.com',
      quantity: 10,
    };

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
  test('상품명이 100자를 초과하면 에러를 발생시킨다.', () => {
    // given
    const productManager = new ProductManager();
    const mockProduct: ProductCreateDTO = {
      name: '아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말아디다스양말',
      price: 5000,
      imgUrl: 'https://abc.com',
      quantity: 10,
    };

    // when & then
    expect(() => {
      productManager.addProduct(mockProduct);
    }).toThrow('상품명은 100자를 초과할 수 없습니다.');
  });
});
