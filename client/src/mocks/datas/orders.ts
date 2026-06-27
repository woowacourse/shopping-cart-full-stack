import type { ServerOrder, ServerCoupon } from "./orders.type";

export const DEFAULT_ORDERS: ServerOrder[] = [];

// Stateful orders store for testing
export let orders: ServerOrder[] = JSON.parse(JSON.stringify(DEFAULT_ORDERS));

export const seedOrders = (nextOrders: ServerOrder[] = DEFAULT_ORDERS) => {
  orders = JSON.parse(JSON.stringify(nextOrders));
};

export const coupons: ServerCoupon[] = [
  {
    id: 1,
    name: "5,000원 할인 (FIXED5000)",
    expirationDate: "2026-11-30T23:59:59Z",
    minOrderAmount: 100000,
    isCouponUsable: true,
  },
  {
    id: 2,
    name: "2+1 쿠폰 (BOGO)",
    expirationDate: "2026-05-30T23:59:59Z",
    isCouponUsable: false,
  },
  {
    id: 3,
    name: "무료 배송 (FREESHIPPING)",
    expirationDate: "2026-08-31T23:59:59Z",
    minOrderAmount: 50000,
    isCouponUsable: true,
  },
  {
    id: 4,
    name: "30% 시간제 할인 (MIRACLESALE)",
    expirationDate: "2026-07-31T23:59:59Z",
    availableHours: "04:00-07:00",
    isCouponUsable: true,
  },
];
