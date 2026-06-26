import { CouponRepository } from './coupon.repository.js';

export default class CouponService {
  constructor(private couponRepository: CouponRepository) {}

  getCoupons() {
    return this.couponRepository.findAll();
  }

  getCouponsByIds(ids: number[]) {
    return this.couponRepository.findByIds(ids);
  }
}
