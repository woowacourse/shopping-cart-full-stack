import {Product} from '../../models/Product.js';
import {InMemoryProductRepository} from './InMemoryProductRepository.js';

const createRepository = () =>
  new InMemoryProductRepository([
    new Product('1', '상품1', 1000, '/image1.png'),
    new Product('2', '상품2', 2000, '/image2.png'),
  ]);

describe('InMemoryProductRepository', () => {
  test('findAll은 상품 목록 복사본을 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.findAll()).toHaveLength(2);
    expect(await repository.findAll()).not.toBe(await repository.findAll());
  });

  test('findById는 id에 해당하는 상품을 반환한다', async () => {
    const repository = createRepository();

    expect((await repository.findById('1'))?.name).toBe('상품1');
  });

  test('findById는 없는 id이면 null을 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.findById('999')).toBeNull();
  });

  test('existsByName은 같은 이름의 상품이 있으면 true를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.existsByName('상품1')).toBe(true);
  });

  test('existsByName은 같은 이름의 상품이 없으면 false를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.existsByName('없는 상품')).toBe(false);
  });

  test('create는 다음 id를 부여한 상품을 생성한다', async () => {
    const repository = createRepository();

    const created = await repository.create({name: '상품3', price: 3000, imageUrl: '/image3.png'});

    expect(created.id).toBe('3');
    expect(await repository.findAll()).toHaveLength(3);
  });

  test('create는 빈 저장소에서 id 1을 부여한다', async () => {
    const repository = new InMemoryProductRepository([]);

    const created = await repository.create({name: '상품', price: 1000, imageUrl: '/image.png'});

    expect(created.id).toBe('1');
  });

  test('deleteById는 상품을 삭제하고 true를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteById('1')).toBe(true);
    expect(await repository.findById('1')).toBeNull();
  });

  test('deleteById는 없는 상품이면 false를 반환한다', async () => {
    const repository = createRepository();

    expect(await repository.deleteById('999')).toBe(false);
  });
});
