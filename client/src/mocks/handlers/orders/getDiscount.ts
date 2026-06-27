import { http, HttpResponse } from "msw";
import type { ServerGetDiscountResponse } from "@/apis/orders/dto";

export const getDiscount = http.get("/api/orders/:orderId/discount", ({ request }) => {
  const url = new URL(request.url);
  const couponIds = url.searchParams.getAll("couponId");

  if (!couponIds || couponIds.length === 0) {
    return HttpResponse.json<ServerGetDiscountResponse>({ status: 200, data: { discountAmount: 0 } }, { status: 200 });
  }

  // Simple mock: calculate discount roughly based on coupon ID (e.g. 5000 for ID 1)
  let discountAmount = 0;
  if (couponIds.includes("1")) discountAmount += 5000;
  // Others not calculated here accurately for simplicity, but could be enhanced
  return HttpResponse.json<ServerGetDiscountResponse>({ status: 200, data: { discountAmount } }, { status: 200 });
});
