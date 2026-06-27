import { couponRepository } from '../../../src/modules/coupons/coupons.repository.js';

describe('CouponRepository 테스트', () => {
  test('전체 쿠폰 목록을 조회한다', () => {
    const coupons = couponRepository.findAll();

    expect(coupons).toHaveLength(4);
  });

  test('쿠폰 id 목록에 해당하는 쿠폰들을 조회한다', () => {
    const coupons = couponRepository.findByIds(['FIXED5000', 'FREESHIPPING']);

    if (!coupons) {
      throw new Error('쿠폰 조회 결과가 undefined입니다.');
    }

    expect(coupons.map((coupon) => coupon.couponId)).toEqual([
      'FIXED5000',
      'FREESHIPPING',
    ]);
  });

  test('존재하지 않는 쿠폰 id를 포함하여 조회할 시 undefined를 반환한다', () => {
    const coupons = couponRepository.findByIds(['FIXED5000', 'UNKNOWN']);

    expect(coupons).toBeUndefined();
  });
});
