import {InMemoryCouponRepository} from './InMemoryCouponRepository.js';

describe('InMemoryCouponRepository', () => {
  test('findAll은 시드 쿠폰 4종을 반환한다', async () => {
    const repository = new InMemoryCouponRepository();

    expect(await repository.findAll()).toHaveLength(4);
  });

  test('findById는 id에 해당하는 쿠폰을 반환한다', async () => {
    const repository = new InMemoryCouponRepository();

    expect((await repository.findById('1'))?.type).toBe('FIXED5000');
  });

  test('findById는 없는 id이면 null을 반환한다', async () => {
    const repository = new InMemoryCouponRepository();

    expect(await repository.findById('999')).toBeNull();
  });
});
