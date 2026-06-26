import {jest} from '@jest/globals';

import {preorderCache, type PreorderItemSnapshot} from '../PreorderCache.js';

const items: PreorderItemSnapshot[] = [
  {
    cartItemId: 'cart-1',
    productId: 'product-1',
    name: '상품A',
    price: 10000,
    imageUrl: '/product-a.png',
    quantity: 2,
  },
];

afterEach(() => {
  jest.useRealTimers();
});

describe('preorderCache', () => {
  test('preorder를 저장하고 id로 조회한다', () => {
    const preorderId = preorderCache.save(items);

    expect(preorderCache.findByIdWithStatus(preorderId)).toEqual({
      status: 'found',
      preorder: expect.objectContaining({
        items,
      }),
    });

    preorderCache.deleteById(preorderId);
  });

  test('저장된 preorder에 결제 미리보기 조건을 저장한다', () => {
    const preorderId = preorderCache.save(items);

    expect(preorderCache.savePreview(preorderId, {couponIds: [1, 3], isRemoteArea: true})).toBe(true);
    expect(preorderCache.findById(preorderId)).toEqual(
      expect.objectContaining({
        preview: {
          couponIds: [1, 3],
          isRemoteArea: true,
        },
      })
    );

    preorderCache.deleteById(preorderId);
  });

  test('없는 preorder에 결제 미리보기 조건을 저장하지 않는다', () => {
    expect(preorderCache.savePreview('unknown', {couponIds: [], isRemoteArea: false})).toBe(false);
  });

  test('TTL이 지난 preorder는 expired 상태를 반환하고 삭제한다', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-22T00:00:00+09:00'));
    const preorderId = preorderCache.save(items);

    jest.setSystemTime(new Date('2026-06-22T00:11:00+09:00'));

    expect(preorderCache.findByIdWithStatus(preorderId)).toEqual({status: 'expired'});
    expect(preorderCache.findByIdWithStatus(preorderId)).toEqual({status: 'notFound'});
  });

  test('preorder를 삭제한다', () => {
    const preorderId = preorderCache.save(items);

    expect(preorderCache.deleteById(preorderId)).toBe(true);
    expect(preorderCache.findByIdWithStatus(preorderId)).toEqual({status: 'notFound'});
  });
});
