export type CouponType = 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';

export class Coupon {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: CouponType,
    public readonly expirationDate: string
  ) {}

  isExpired(now: Date = new Date()) {
    return new Date(this.expirationDate).getTime() < now.getTime();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      expirationDate: this.expirationDate,
    };
  }
}
