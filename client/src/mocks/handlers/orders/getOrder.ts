import { http, HttpResponse } from "msw";
import { orders } from "@/mocks/datas/orders";
import type { ServerGetOrderResponse } from "@/apis/orders/dto";

export const getOrder = http.get("/api/orders/:orderId", ({ params }) => {
  const { orderId } = params;

  const order = orders.find((o) => o.orderId === Number(orderId));

  if (!order) {
    // According to spec, 409 is for "주문 만료", let's use it as default not found/expired here
    return HttpResponse.json(
      { status: 409, errorCode: "ORDER_EXPIRED", errorMessage: "주문이 만료되었습니다." },
      { status: 409 },
    );
  }

  return HttpResponse.json<ServerGetOrderResponse>(
    {
      status: 200,
      data: {
        products: order.products,
        coupons: order.coupons ?? [],
        isRemoteArea: order.isRemoteArea ?? false,
        deliveryFee: order.deliveryFee,
      },
    },
    { status: 200 },
  );
});
