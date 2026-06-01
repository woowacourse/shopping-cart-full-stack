import {jest} from '@jest/globals';

const loadProductService = async () => {
  jest.resetModules();
  const productServiceModule = await import('./ProductService.js');
  const httpErrorsModule = await import('../errors/HttpError.js');
  const dbModule = await import('../db.js');

  return {
    productService: productServiceModule.productService,
    cartItems: dbModule.cartItems,
    InvalidInputError: httpErrorsModule.InvalidInputError,
    NotFoundError: httpErrorsModule.NotFoundError,
    DuplicateNameError: httpErrorsModule.DuplicateNameError,
  };
};

describe('productService', () => {
  test('getProducts는 상품 목록을 반환한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.getProducts()).toHaveLength(5);
  });

  test('createProduct는 생성된 상품 전체를 반환한다', async () => {
    const {productService} = await loadProductService();

    const newProduct = productService.createProduct({name: '새 상품', price: 1000, imageUrl: '/new.png'});

    expect(newProduct).toMatchObject({
      id: '6',
      name: '새 상품',
      price: 1000,
      imageUrl: '/new.png',
    });
    expect(productService.getProducts()).toHaveLength(6);
  });

  test('createProduct는 중복 상품명이면 DuplicateNameError를 던진다', async () => {
    const {productService, DuplicateNameError} = await loadProductService();

    expect(() => productService.createProduct({name: 'EASTER', price: 1000, imageUrl: '/new.png'})).toThrow(
      DuplicateNameError,
    );
  });

  describe('createProduct는 유효하지 않은 요청이면 InvalidInputError를 던진다', () => {
    const invalidCases: Array<[string, unknown]> = [
      ['이름이 빈 문자열', {name: '', price: 1000, imageUrl: '/new.png'}],
      ['이름이 100자를 초과', {name: 'a'.repeat(101), price: 1000, imageUrl: '/new.png'}],
      ['이름이 문자열이 아닌 값', {name: 123, price: 1000, imageUrl: '/new.png'}],
      ['가격이 0 이하', {name: '상품', price: 0, imageUrl: '/new.png'}],
      ['가격이 음수', {name: '상품', price: -1, imageUrl: '/new.png'}],
      ['가격이 무한대', {name: '상품', price: Number.POSITIVE_INFINITY, imageUrl: '/new.png'}],
      ['가격이 문자열', {name: '상품', price: '1000', imageUrl: '/new.png'}],
      ['imageUrl이 빈 문자열', {name: '상품', price: 1000, imageUrl: ''}],
      ['imageUrl이 undefined', {name: '상품', price: 1000, imageUrl: undefined}],
      ['body가 null', null],
      ['body가 객체가 아닌 값', '상품'],
    ];

    test.each(invalidCases)('%s이면 InvalidInputError를 던진다', async (_label, body) => {
      const {productService, InvalidInputError} = await loadProductService();

      expect(() => productService.createProduct(body)).toThrow(InvalidInputError);
    });
  });

  test('deleteProduct는 상품과 연결된 장바구니 항목을 함께 삭제한다', async () => {
    const {productService, cartItems} = await loadProductService();

    productService.deleteProduct('1');

    expect(productService.getProducts().some((product) => product.id === '1')).toBe(false);
    expect(cartItems.findAll().some((cartItem) => cartItem.productInfo.id === '1')).toBe(false);
  });

  test('deleteProduct는 없는 상품이면 NotFoundError를 던진다', async () => {
    const {productService, NotFoundError} = await loadProductService();

    expect(() => productService.deleteProduct('999')).toThrow(NotFoundError);
  });
});
