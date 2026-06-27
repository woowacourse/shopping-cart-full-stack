import { CouponEntity } from "../interfaces/coupon.interface.js";

const coupons: CouponEntity[] = [
  {
    id: 1,
    name: "5,000원 할인 쿠폰",
    description: ["만료일: 2027년 11월 30일", "최소 주문 금액: 100,000원"],
    expiredAt: new Date("2027-11-30"),
    isUsed: false,
    couponType: "FIXED",
    minimumOrderPrice: 100000,
    fixedAmount: 5000,
  },
  {
    id: 2,
    name: "2개 구매 시 1개 무료 쿠폰",
    description: ["만료일: 2027년 5월 30일"],
    expiredAt: new Date("2027-05-30"),
    isUsed: false,
    couponType: "BOGO",
  },
  {
    id: 3,
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    description: ["만료일: 2027년 5월 30일", "최소 주문 금액: 50,000원"],
    expiredAt: new Date("2027-08-31"),
    isUsed: false,
    couponType: "FREESHIPPING",
    minimumOrderPrice: 50000,
  },
  {
    id: 4,
    name: "미라클모닝 30% 할인 쿠폰",
    description: ["만료일: 2027년 5월 30일", "사용 가능 시간: 오전 4시부터 7시까지"],
    expiredAt: new Date("2027-07-31"),
    isUsed: false,
    couponType: "RATE",
    startedAt: "04:00:00",
    endedAt: "07:00:00",
    rateAmount: 30,
  },
];

export function findAll(): CouponEntity[] {
  return [...coupons];
}

export function findById(id: number): CouponEntity | null {
  return coupons.find((coupon) => coupon.id === id) ?? null;
}
