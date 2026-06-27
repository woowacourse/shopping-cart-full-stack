import {
  DuplicateNameError,
  InvalidInputError,
  NotFoundError,
} from '../errors/HttpError.js';
import {InMemoryCartItemRepository} from '../repositories/memory/InMemoryCartItemRepository.js';
import {InMemoryProductRepository} from '../repositories/memory/InMemoryProductRepository.js';
import {createProductService} from './ProductService.js';

const createService = () => {
  const productRepository = new InMemoryProductRepository();
  const cartItemRepository = new InMemoryCartItemRepository();
  const productService = createProductService({productRepository, cartItemRepository});

  return {productService, productRepository, cartItemRepository};
};

describe('productService', () => {
  test('getProducts는 상품 목록을 반환한다', async () => {
    const {productService} = createService();

    expect(await productService.getProducts()).toHaveLength(5);
  });

  test('createProduct는 생성된 상품 전체를 반환한다', async () => {
    const {productService} = createService();

    const newProduct = await productService.createProduct({name: '새 상품', price: 1000, imageUrl: '/new.png'});

    expect(newProduct).toMatchObject({
      id: '6',
      name: '새 상품',
      price: 1000,
      imageUrl: '/new.png',
    });
    expect(await productService.getProducts()).toHaveLength(6);
  });

  test('createProduct는 중복 상품명이면 DuplicateNameError를 던진다', async () => {
    const {productService} = createService();

    await expect(
      productService.createProduct({name: 'EASTER', price: 1000, imageUrl: '/new.png'}),
    ).rejects.toThrow(DuplicateNameError);
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
      const {productService} = createService();

      await expect(productService.createProduct(body)).rejects.toThrow(InvalidInputError);
    });
  });

  test('deleteProduct는 상품과 연결된 장바구니 항목을 함께 삭제한다', async () => {
    const {productService, cartItemRepository} = createService();

    await productService.deleteProduct('1');

    expect((await productService.getProducts()).some((product) => product.id === '1')).toBe(false);
    expect((await cartItemRepository.findAll()).some((cartItem) => cartItem.productId === '1')).toBe(false);
  });

  test('deleteProduct는 없는 상품이면 NotFoundError를 던진다', async () => {
    const {productService} = createService();

    await expect(productService.deleteProduct('999')).rejects.toThrow(NotFoundError);
  });
});
