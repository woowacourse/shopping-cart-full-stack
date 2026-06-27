import { http, HttpResponse } from "msw";
import { coupons } from "@/mocks/datas/orders";
import type { ServerGetCouponsResponse } from "@/apis/orders/dto";

export const getCoupons = http.get("/api/orders/:orderId/coupons", () => {
  return HttpResponse.json<ServerGetCouponsResponse>({ status: 200, data: { coupons } }, { status: 200 });
});
