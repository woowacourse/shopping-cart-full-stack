import {
  BogoCoupon,
  Coupon,
  CouponItem,
  FixedCoupon,
  FreeShippingCoupon,
  MiracleSaleCoupon,
} from "./Coupon.js";

export interface CouponRepository {
  create({
    baseInformation,
    discountPolicy,
    condition,
  }: Omit<CouponItem, "id">): Coupon;
  findById(CouponId: number): Coupon | undefined;
  getCouponList(): Coupon[];
}

export class InMemoryCouponRepository implements CouponRepository {
  private coupons: Array<Coupon> = [];
  private id = 1;

  create({
    baseInformation,
    discountPolicy,
    condition,
  }: Omit<CouponItem, "id">) {
    let coupon = null;
    const couponType = baseInformation.type;
    if (couponType.includes("FIXED")) {
      coupon = new FixedCoupon(
        this.id,
        baseInformation,
        discountPolicy,
        condition,
      );
    }
    if (couponType.includes("BOGO")) {
      coupon = new BogoCoupon(
        this.id,
        baseInformation,
        discountPolicy,
        condition,
      );
    }
    if (couponType.includes("FREESHIPPING")) {
      coupon = new FreeShippingCoupon(
        this.id,
        baseInformation,
        discountPolicy,
        condition,
      );
    }
    if (couponType.includes("MIRACLESALE")) {
      coupon = new MiracleSaleCoupon(
        this.id,
        baseInformation,
        discountPolicy,
        condition,
      );
    }

    if (!coupon) {
      throw new Error("존재하지 않는 쿠폰 타입입니다.");
    }

    this.coupons.push(coupon);
    this.id++;

    return coupon;
  }

  findById(couponId: number) {
    return this.coupons.find((coupon) => coupon.isSameId(couponId));
  }

  getCouponList() {
    return [...this.coupons];
  }
}
