import { http, HttpResponse } from "msw";
import { coupons } from "@/mocks/datas/orders";

export const ordersScenarios = {
  postSuccess: http.post("/api/orders", () => {
    return HttpResponse.json({ status: 201, data: { orderId: 100 } }, { status: 201 });
  }),

  postMissingField: http.post("/api/orders", () => {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [{ type: "products", errorCode: "MISSING_FIELD_PRODUCTS" }],
      },
      { status: 400 },
    );
  }),

  postTypeMismatch: http.post("/api/orders", () => {
    return HttpResponse.json(
      { status: 400, errorCode: "TYPE_MISMATCH", errorMessage: "타입이 일치하지 않습니다." },
      { status: 400 },
    );
  }),

  postOutOfStock: http.post("/api/orders", () => {
    return HttpResponse.json(
      { status: 409, errorCode: "OUT_OF_STOCK", errorMessage: "품절된 상품이 포함되어 있습니다." },
      { status: 409 },
    );
  }),

  getSuccess: http.get("/api/orders/:orderId", () => {
    return HttpResponse.json({ status: 200, data: { products: [], coupons: [], isRemoteArea: false, deliveryFee: 3000 } }, { status: 200 });
  }),

  getExpired: http.get("/api/orders/:orderId", () => {
    return HttpResponse.json({ status: 409, errorCode: "ORDER_EXPIRED", errorMessage: "주문이 만료되었습니다." }, { status: 409 });
  }),

  patchSuccess: http.patch("/api/orders/:orderId", () => {
    return HttpResponse.json({ status: 200, data: { couponId: [1], isRemoteArea: true, deliveryFee: 6000 } }, { status: 200 });
  }),

  patchCouponExpired: http.patch("/api/orders/:orderId", () => {
    return HttpResponse.json({ status: 422, errorCode: "COUPON_EXPIRED", errorMessage: "만료된 쿠폰입니다." }, { status: 422 });
  }),

  getDiscountSuccess: http.get("/api/orders/:orderId/discount", () => {
    return HttpResponse.json({ status: 200, data: { discountAmount: 5000 } }, { status: 200 });
  }),

  getCouponsSuccess: http.get("/api/orders/:orderId/coupons", () => {
    return HttpResponse.json({ status: 200, data: { coupons } }, { status: 200 });
  }),
};
