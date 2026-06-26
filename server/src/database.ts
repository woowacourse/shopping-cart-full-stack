interface RequestBody {
  id?: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

export type CouponType = 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';

interface Coupon {
  id: number;
  name: string;
  type: CouponType;
  expirationDate: string;
}

interface DB {
  Products: RequestBody[];
  Cart: RequestBody[];
  Coupons: Coupon[];
}

const COUPONS: Coupon[] = [
  { id: 1, name: '5,000원 할인 쿠폰', type: 'FIXED5000', expirationDate: '2026-11-30' },
  { id: 2, name: '2개 구매 시 1개 무료 쿠폰', type: 'BOGO', expirationDate: '2026-06-30' },
  { id: 3, name: '5만원 이상 구매 시 무료 배송 쿠폰', type: 'FREESHIPPING', expirationDate: '2026-08-31' },
  { id: 4, name: '미라클모닝 30% 할인 쿠폰', type: 'MIRACLESALE', expirationDate: '2026-07-31' },
];

export const DB: DB = {
  Products: [],
  Cart: [],
  Coupons: COUPONS,
};
