import {CartItem} from '../../models/CartItem.js';
import {InMemoryCartItemRepository} from './InMemoryCartItemRepository.js';

const createRepository = () =>
  new InMemoryCartItemRepository([
    new CartItem('1', '1', 1),
    new CartItem('2', '2', 2),
  ]);

describe('InMemoryCartItemRepository', () => {
  test('findAll은 장바구니 항목 목록 복사본을 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll()).not.toBe(await repository.findAll());
  });

  test('findById는 id에 해당하는 장바구니 항목을 반환한다', async () => {
    const repository = createRepository();

    expect((await repository.findById('1'))?.id).toBe('1');
  });

  test('findById는 없는 id이면 null을 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.findById('999')).toBeNull();
  });

  test('updateQuantity는 수량을 변경하고 항목을 반환한다', async () => {
    const repository = createRepository();

    const updated = await repository.updateQuantity('1', 3);

    expect(updated?.getQuantity()).toBe(3);
  });

  test('updateQuantity는 없는 항목이면 null을 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.updateQuantity('999', 3)).toBeNull();
  });

  test('deleteById는 장바구니 항목을 삭제하고 true를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteById('1')).toBe(true);
    expect(await repository.findById('1')).toBeNull();
  });

  test('deleteById는 없는 항목이면 false를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteById('999')).toBe(false);
  });

  test('deleteByProductId는 상품 id에 해당하는 항목을 삭제하고 true를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteByProductId('1')).toBe(true);
    expect(await repository.findById('1')).toBeNull();
  });

  test('deleteByProductId는 없는 상품 id이면 false를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteByProductId('999')).toBe(false);
  });
});
