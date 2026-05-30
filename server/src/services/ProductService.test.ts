import {jest} from '@jest/globals';

const loadProductService = async () => {
  jest.resetModules();
  return import('./ProductService.js');
};

describe('product validators', () => {
  test('isValidProductName은 1자 이상 100자 이하의 문자열만 허용한다', async () => {
    const {isValidProductName} = await loadProductService();

    expect(isValidProductName('상품')).toBe(true);
    expect(isValidProductName('a'.repeat(100))).toBe(true);
    expect(isValidProductName('')).toBe(false);
    expect(isValidProductName('a'.repeat(101))).toBe(false);
  });

  test('isValidPrice는 0보다 큰 유한한 숫자만 허용한다', async () => {
    const {isValidPrice} = await loadProductService();

    expect(isValidPrice(1)).toBe(true);
    expect(isValidPrice(0)).toBe(false);
    expect(isValidPrice(-1)).toBe(false);
    expect(isValidPrice(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isValidPrice('1')).toBe(false);
  });

  test('isValidImageUrl은 빈 문자열이 아닌 문자열만 허용한다', async () => {
    const {isValidImageUrl} = await loadProductService();

    expect(isValidImageUrl('/image.png')).toBe(true);
    expect(isValidImageUrl('')).toBe(false);
    expect(isValidImageUrl(undefined)).toBe(false);
  });

  test('isCreateProductRequestBody는 null이 아닌 객체만 허용한다', async () => {
    const {isCreateProductRequestBody} = await loadProductService();

    expect(isCreateProductRequestBody({})).toBe(true);
    expect(isCreateProductRequestBody(null)).toBe(false);
    expect(isCreateProductRequestBody('상품')).toBe(false);
  });

  test('isValidCreateProductBody는 상품 생성 요청 필드를 검증한다', async () => {
    const {isValidCreateProductBody} = await loadProductService();

    expect(isValidCreateProductBody({name: '상품', price: 1000, imageUrl: '/image.png'})).toBe(true);
    expect(isValidCreateProductBody({price: 1000, imageUrl: '/image.png'})).toBe(false);
    expect(isValidCreateProductBody({name: '상품', imageUrl: '/image.png'})).toBe(false);
    expect(isValidCreateProductBody({name: '상품', price: 1000})).toBe(false);
  });
});

describe('productService', () => {
  test('getProducts는 상품 목록을 반환한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.getProducts()).toHaveLength(5);
  });

  test('createProduct는 상품을 생성한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.createProduct({name: '새 상품', price: 1000, imageUrl: '/new.png'})).toEqual({
      status: 'created',
      id: '6',
    });
  });

  test('createProduct는 중복 상품명이면 duplicated를 반환한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.createProduct({name: 'EASTER', price: 1000, imageUrl: '/new.png'})).toEqual({
      status: 'duplicated',
    });
  });

  test('createProduct는 유효하지 않은 요청이면 invalid를 반환한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.createProduct({name: '', price: 1000, imageUrl: '/new.png'})).toEqual({
      status: 'invalid',
      message: '상품 이름, 가격, 이미지 URL을 올바르게 입력해주세요.',
    });
  });

  test('deleteProduct는 상품과 연결된 장바구니 항목을 삭제한다', async () => {
    const {productService} = await loadProductService();
    const {cartItems} = await import('../db.js');

    expect(productService.deleteProduct('1')).toEqual({
      status: 'deleted',
    });
    expect(productService.getProducts().some((product) => product.id === '1')).toBe(false);
    expect(cartItems.findAll().some((cartItem) => cartItem.productInfo.id === '1')).toBe(false);
  });

  test('deleteProduct는 없는 상품이면 notFound를 반환한다', async () => {
    const {productService} = await loadProductService();

    expect(productService.deleteProduct('999')).toEqual({
      status: 'notFound',
    });
  });
});
