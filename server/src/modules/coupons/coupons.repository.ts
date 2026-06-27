import { couponDB } from '../../db.js';
import { CouponPolicy } from '../../interfaces/couponPolicy.interface.js';
import { CouponRepository } from '../../interfaces/repository.interface.js';

export const couponRepository: CouponRepository = {
  findAll() {
    return Array.from(couponDB.values());
  },

  findByIds(couponIds: string[]) {
    const coupons = couponIds.map((couponId) => couponDB.get(couponId));

    if (coupons.some((coupon) => coupon === undefined)) return undefined;

    return coupons as CouponPolicy[];
  },
};
