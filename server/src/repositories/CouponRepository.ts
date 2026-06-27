import type { Coupon } from '../models/Coupon.js';

export interface CouponRepository {
  findAll(): Promise<Coupon[]>;
  findById(id: string): Promise<Coupon | null>;
}
