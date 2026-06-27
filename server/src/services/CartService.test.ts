import {InvalidInputError, NotFoundError} from '../errors/HttpError.js';
import {InMemoryCartItemRepository} from '../repositories/memory/InMemoryCartItemRepository.js';
import {InMemoryProductRepository} from '../repositories/memory/InMemoryProductRepository.js';
import {createCartService} from './CartService.js';

const createService = () => {
  const cartItemRepository = new InMemoryCartItemRepository();
  const productRepository = new InMemoryProductRepository();
  const cartService = createCartService({cartItemRepository, productRepository});

  return {cartService, cartItemRepository, productRepository};
};

describe('cartService', () => {
  test('getCartItems는 장바구니 항목 목록을 상품 정보와 함께 반환한다', async () => {
    const {cartService} = createService();

    const items = await cartService.getCartItems();

    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      id: '1',
      quantity: 1,
      product: {id: '1'},
    });
  });

  test('updateQuantity는 수량을 변경하고 갱신된 장바구니 항목을 반환한다', async () => {
    const {cartService} = createService();

    const updated = await cartService.updateQuantity('1', {quantity: 3});

    expect(updated.id).toBe('1');
    expect(updated.quantity).toBe(3);
    expect((await cartService.getCartItems()).find((item) => item.id === '1')?.quantity).toBe(3);
  });

  describe('updateQuantity는 유효하지 않은 요청이면 InvalidInputError를 던진다', () => {
    const invalidCases: Array<[string, unknown]> = [
      ['quantity가 0', {quantity: 0}],
      ['quantity가 최솟값 미만(음수)', {quantity: -1}],
      ['quantity가 최댓값 초과(100)', {quantity: 100}],
      ['quantity가 정수가 아닌 소수', {quantity: 1.5}],
      ['quantity가 문자열', {quantity: '3'}],
      ['quantity 필드가 누락', {}],
      ['body가 null', null],
      ['body가 객체가 아닌 값', '3'],
    ];

    test.each(invalidCases)('%s이면 InvalidInputError를 던진다', async (_label, body) => {
      const {cartService} = createService();

      await expect(cartService.updateQuantity('1', body)).rejects.toThrow(InvalidInputError);
    });
  });

  test('updateQuantity는 없는 항목이면 NotFoundError를 던진다', async () => {
    const {cartService} = createService();

    await expect(cartService.updateQuantity('999', {quantity: 3})).rejects.toThrow(NotFoundError);
  });

  test('deleteCartItem은 장바구니 항목을 삭제한다', async () => {
    const {cartService} = createService();

    await cartService.deleteCartItem('1');

    const items = await cartService.getCartItems();
    expect(items).toHaveLength(2);
    expect(items.some((item) => item.id === '1')).toBe(false);
  });

  test('deleteCartItem은 없는 항목이면 NotFoundError를 던진다', async () => {
    const {cartService} = createService();

    await expect(cartService.deleteCartItem('999')).rejects.toThrow(NotFoundError);
  });
});
