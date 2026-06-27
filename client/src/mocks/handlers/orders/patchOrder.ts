import { http, HttpResponse } from "msw";
import { orders } from "@/mocks/datas/orders";
import type { ServerPatchOrderResponse } from "@/apis/orders/dto";

export const patchOrder = http.patch("/api/orders/:orderId", async ({ params, request }) => {
  const { orderId } = params;
  const body = (await request.json()) as { couponId?: number[]; isRemoteArea?: boolean };

  const order = orders.find((o) => o.orderId === Number(orderId));

  if (!order) {
    return HttpResponse.json(
      { status: 409, errorCode: "ORDER_EXPIRED", errorMessage: "주문이 만료되었습니다." },
      { status: 409 },
    );
  }

  if (body.couponId !== undefined && !Array.isArray(body.couponId)) {
    return HttpResponse.json(
      { status: 400, errorCode: "TYPE_MISMATCH", errorMessage: "타입이 일치하지 않습니다." },
      { status: 400 },
    );
  }

  // Update order
  if (body.couponId !== undefined) order.coupons = body.couponId;
  if (body.isRemoteArea !== undefined) order.isRemoteArea = body.isRemoteArea;

  // Recalculate delivery fee mock logic
  // "무료 배송 (FREESHIPPING)" is coupon id 3
  const hasFreeShipping = order.coupons?.includes(3);
  order.deliveryFee = hasFreeShipping ? 0 : order.isRemoteArea ? 6000 : 3000;

  return HttpResponse.json<ServerPatchOrderResponse>(
    {
      status: 200,
      data: {
        couponId: order.coupons,
        isRemoteArea: order.isRemoteArea,
        deliveryFee: order.deliveryFee,
      },
    },
    { status: 200 },
  );
});
