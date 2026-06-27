import { type InMemoryDB } from "../../db/in-memory-db.js";
import { CouponEntity } from "./coupon.entity.js";
import FixedCoupon from "./coupons/fixed-coupon.js";
import BogoCoupon from "./coupons/bogo-coupon.js";
import MiracleSaleCoupon from "./coupons/miracle-sale-coupon.js";
import FreeShippingCoupon from "./coupons/free-shipping-coupon.js";

import { Coupon } from "./coupon.type.js";

export interface CouponRepository {
  findAll: () => Promise<Coupon[]>;
  save: (coupon: CouponEntity) => Promise<CouponEntity>;
}

export default class InMemoryCouponRepository implements CouponRepository {
  constructor(private db: InMemoryDB) {}

  async findAll(): Promise<Coupon[]> {
    return this.db.COUPON_TABLE.map((row) => this.toCoupon(row));
  }

  async save(coupon: CouponEntity): Promise<CouponEntity> {
    this.db.COUPON_TABLE.push(coupon);
    return coupon;
  }

  private toCoupon(entity: CouponEntity): Coupon {
    switch (entity.discount_type) {
      case "FIXED":
        return FixedCoupon.from(entity);
      case "BOGO":
        return BogoCoupon.from(entity);
      case "MIRACLESALE":
        return MiracleSaleCoupon.from(entity);
      case "FREESHIPPING":
        return FreeShippingCoupon.from(entity);
      default:
        throw new Error("정의되지 않은 쿠폰입니다 ");
    }
  }
}
