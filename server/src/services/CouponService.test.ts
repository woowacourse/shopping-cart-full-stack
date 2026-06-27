import {InMemoryCouponRepository} from '../repositories/memory/InMemoryCouponRepository.js';
import {createCouponService} from './CouponService.js';

const createService = () => {
  const couponRepository = new InMemoryCouponRepository();
  const couponService = createCouponService({couponRepository});

  return {couponService, couponRepository};
};

describe('couponService', () => {
  test('getCoupons는 사용 가능한 쿠폰 목록을 반환한다', async () => {
    const {couponService} = createService();

    const coupons = await couponService.getCoupons();

    expect(coupons).toHaveLength(4);
    expect(coupons.map((coupon) => coupon.type)).toEqual([
      'FIXED5000',
      'BOGO',
      'FREESHIPPING',
      'MIRACLESALE',
    ]);
  });
});
