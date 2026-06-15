import { Coupon } from "./Coupon";

export default class CouponRepository {
  // Coupons의 데이터를 담고 있는 private 변수
  // Map 형태에 넣어주기 위한 index로 nextId
  #Coupons: Map<number, Coupon>;

  constructor() {
    this.#Coupons = new Map();
  }

  getCoupons(): Coupon[] {
    return [...this.#Coupons.values()];
  }

  findById(productId: number): Coupon | null {
    return this.#Coupons.get(productId) ?? null;
  }

  deleteById(productId: number): void {
    this.#Coupons.delete(productId);
  }

  clear(): void {
    this.#Coupons.clear();
  }
}

export const couponRepository = new CouponRepository();
