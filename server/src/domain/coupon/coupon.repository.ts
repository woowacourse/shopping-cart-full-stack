import AppError from '../../errors/AppError.js';
import { coupons } from '../../db/inMemoryDb.js';
import { Coupon } from '../../model/Coupon.js';

export interface CouponRepository {
  findAll: () => Coupon[];
  findByIds: (ids: number[]) => Coupon[];
}

export class InMemoryCouponRepository implements CouponRepository {
  findAll() {
    return [...coupons];
  }

  findByIds(ids: number[]) {
    return ids.map((id) => {
      const target = coupons.find((coupon) => coupon.id === id);

      if (!target) throw new AppError('COUPON_NOT_EXIST');

      return target;
    });
  }
}
