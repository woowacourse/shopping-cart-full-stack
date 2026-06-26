export const coupons = [
  {
    id: 1,
    code: "FIXED5000",
    name: "5,000원 할인 쿠폰",
    expirationDate: "2026-11-30",
    minimumOrderAmount: 100000,
  },
  {
    id: 2,
    code: "BOGO",
    name: "2개 구매 시 1개 무료 쿠폰",
    expirationDate: "2026-06-30",
  },
  {
    id: 3,
    code: "FREESHIPPING",
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    expirationDate: "2026-08-31",
    minimumOrderAmount: 50000,
  },
  {
    id: 4,
    code: "MIRACLESALE",
    name: "미라클모닝 30% 할인 쿠폰",
    expirationDate: "2026-07-31",
    validityPeriod: {
      startsAt: "04:00",
      endsAt: "07:00",
    },
  },
];
