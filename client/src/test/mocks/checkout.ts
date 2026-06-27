import { http, HttpResponse } from "msw";

export const postCheckoutHandler = http.post("*/checkout", () => {
  return HttpResponse.json({
    price_summary: {
      order_price: 79700,
      dicount_price: 0,
      delivery_price: 3000,
      total_price: 82700,
    },
    selected_items: [
      {
        id: "1",
        product: {
          name: "베이직 코튼 티셔츠",
          price: 19900,
          thumbnail: "https://placehold.co/300x300.png",
        },
        quantity: 2,
      },
      {
        id: "3",
        product: {
          name: "오버핏 후드티",
          price: 39900,
          thumbnail: "https://placehold.co/300x300.png",
        },
        quantity: 1,
      },
    ],
    coupons_info: [
      {
        id: "FIXED5000",
        name: "5,000원 할인 쿠폰",
        expiriation_date: "2026-11-30T00:00:00.000Z",
        rule: { type: "LOW_PRICE" as const, price: 100000 },
        status: {
          type: "UNUSABLE" as const,
          message: "",
          apply: false,
        },
        discount: { type: "FIXED" as const, amount: 5000 },
      },
      {
        id: "BOGO",
        name: "2개 구매 시 1개 무료 쿠폰",
        expiriation_date: "2026-06-30T00:00:00.000Z",
        rule: null,
        status: {
          type: "USABLE" as const,
          message: "",
          apply: false,
        },
        discount: { type: "FIXED" as const, amount: 0 },
      },
      {
        id: "FREESHIPPING",
        name: "5만원 이상 구매 시 무료 배송 쿠폰",
        expiriation_date: "2026-08-31T00:00:00.000Z",
        rule: { type: "LOW_PRICE" as const, price: 50000 },
        status: {
          type: "USABLE" as const,
          message: "",
          apply: false,
        },
        discount: { type: "FIXED" as const, amount: 3000 },
      },
      {
        id: "MIRACLESALE",
        name: "미라클모닝 30% 할인 쿠폰",
        expiriation_date: "2026-07-31T00:00:00.000Z",
        rule: { type: "TIME" as const, startAt: "04:00", endAt: "07:00" },
        status: {
          type: "UNUSABLE" as const,
          message: "",
          apply: false,
        },
        discount: { type: "RATE" as const, rate: 30 },
      },
    ],
    best_coupons: ["BOGO", "FREESHIPPING"],
    gifts: [],
  });
});

export const postPaymentHandler = http.post("*/payment", async () => {
  return HttpResponse.json({
    receipt_id: `receipt-${Date.now()}`,
  });
});
