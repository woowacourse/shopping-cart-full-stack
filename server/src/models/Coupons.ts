import {Coupon} from './Coupon.js';

export class Coupons {
  constructor(private coupons: Coupon[]) {}

  findAll() {
    return [...this.coupons];
  }

  findById(id: number) {
    return this.coupons.find((coupon) => coupon.id === id);
  }
}
