import Coupon from "../domain/coupon/Coupon.ts";
import type { CouponType } from "../types/type.ts";

export class CouponRepository {
  private coupons = new Map<number, Coupon>();

  save(coupon: Coupon) {
    this.coupons.set(coupon.id, coupon);
  }

  getAll(): Coupon[] {
    return [...this.coupons.values()];
  }

  getById(id: number): Coupon | undefined {
    return this.coupons.get(id);
  }

  getByIds(ids: number[]): Coupon[] {
    return ids
      .map((id) => this.coupons.get(id))
      .filter((coupon): coupon is Coupon => coupon !== undefined);
  }

  getByTypes(types: CouponType[]): Coupon[] {
    return this.getAll().filter((coupon) => types.includes(coupon.type));
  }

  hasId(id: number): boolean {
    return this.coupons.has(id);
  }

  clear() {
    this.coupons.clear();
  }
}
