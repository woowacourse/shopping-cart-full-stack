import { Coupon } from '../../models/Coupon.js';
import type { CouponRepository } from '../CouponRepository.js';
import { createSeedCoupons } from './seed.js';

export class InMemoryCouponRepository implements CouponRepository {
  private coupons: Coupon[];

  constructor(initial: Coupon[] = createSeedCoupons()) {
    this.coupons = [...initial];
  }

  async findAll(): Promise<Coupon[]> {
    return [...this.coupons];
  }

  async findById(id: string): Promise<Coupon | null> {
    return this.coupons.find((coupon) => coupon.id === id) ?? null;
  }
}
