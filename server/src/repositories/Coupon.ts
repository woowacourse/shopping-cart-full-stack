export interface Coupon {
  couponId: number;
  couponCode: string; // 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE'
  expiredDate: string;
  minOrderAmount: number;
  usableStartAt: string | null;
  usableEndAt: string | null;
  discountAmount?: number; // FIXED5000용 → 5000
  discountRate?: number; // MIRACLESALE용 → 30
}
