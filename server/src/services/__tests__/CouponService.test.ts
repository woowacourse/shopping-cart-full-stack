import {jest} from '@jest/globals';

import type {Preorder} from '../../types/preorder.js';

const loadCouponService = async () => {
  jest.resetModules();
  return import('../CouponService.js');
};

const createPreorder = (price: number, quantity: number): Preorder => {
  return {
    preorderId: 'preorder-1',
    items: [
      {
        productId: '1',
        price,
        name: '상품',
        imageUrl: '/image.png',
        quantity,
      },
    ],
  };
};

describe('couponService', () => {
  test('getCoupons는 쿠폰 목록 응답을 반환한다', async () => {
    const {couponService} = await loadCouponService();
    const preorder = createPreorder(100000, 2);

    const {coupons} = couponService.getCoupons(preorder, false);

    expect(coupons).toHaveLength(4);
    expect(coupons[0]).toEqual(
      expect.objectContaining({
        couponId: 1,
        code: 'FIXED5000',
        name: '5000원 할인 쿠폰',
        condition: expect.objectContaining({
          description: '최소 주문 금액: 100,000원',
        }),
        disabled: false,
        disabledReason: null,
      })
    );
  });

  test('getCoupons는 쿠폰 만료일을 ISO 문자열로 반환한다', async () => {
    const {couponService} = await loadCouponService();
    const preorder = createPreorder(100000, 2);

    const {coupons} = couponService.getCoupons(preorder, false);

    expect(coupons[0].expirationDate).toBe('2026-11-30T14:59:59.000Z');
  });

  test('getCoupons는 화면에 표시할 조건 설명을 반환한다', async () => {
    const {couponService} = await loadCouponService();
    const preorder = createPreorder(100000, 2);

    const {coupons} = couponService.getCoupons(preorder, false);
    const fixedCoupon = coupons.find((coupon) => coupon.code === 'FIXED5000');
    const bogoCoupon = coupons.find((coupon) => coupon.code === 'BOGO');
    const freeShippingCoupon = coupons.find((coupon) => coupon.code === 'FREESHIPPING');
    const miracleSaleCoupon = coupons.find((coupon) => coupon.code === 'MIRACLESALE');

    expect(fixedCoupon?.condition.description).toBe('최소 주문 금액: 100,000원');
    expect(bogoCoupon?.condition.description).toBeNull();
    expect(freeShippingCoupon?.condition.description).toBe('최소 주문 금액: 50,000원');
    expect(miracleSaleCoupon?.condition.description).toBe('사용 가능 시간: 오전 4시부터 오전 7시까지');
  });

  test('getCoupons는 사용 불가능한 쿠폰에 disabledReason을 포함한다', async () => {
    const {couponService} = await loadCouponService();
    const preorder = createPreorder(1000, 1);

    const {coupons} = couponService.getCoupons(preorder, false);
    const fixedCoupon = coupons.find((coupon) => coupon.code === 'FIXED5000');
    const bogoCoupon = coupons.find((coupon) => coupon.code === 'BOGO');

    expect(fixedCoupon).toEqual(
      expect.objectContaining({
        disabled: true,
        disabledReason: '주문 금액이 100,000원 미만입니다.',
      })
    );
    expect(bogoCoupon).toEqual(
      expect.objectContaining({
        disabled: true,
        disabledReason: '동일 상품을 2개 이상 구매해야 합니다.',
      })
    );
  });

  test('getCoupons는 적용 가능한 쿠폰 중 최대 할인 추천 쿠폰 ID를 반환한다', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-22T12:00:00+09:00'));

    const {couponService} = await loadCouponService();
    const preorder = createPreorder(50000, 1);

    const {recommendedCouponIds} = couponService.getCoupons(preorder, true);

    expect(recommendedCouponIds).toEqual([3]);

    jest.useRealTimers();
  });
});
