import { http, HttpResponse } from "msw";
import { cart } from "@/mocks/datas/carts";

export const getCart = http.get("/api/carts/:cartId", ({ params }) => {
  const { cartId } = params;

  // In this simple mock, we only support cartId === 1.
  if (Number(cartId) !== 1) {
    return HttpResponse.json(
      {
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 장바구니가 존재하지 않습니다.",
      },
      { status: 404 },
    );
  }

  return HttpResponse.json(
    {
      status: 200,
      data: {
        ...cart,
        id: Number(cartId),
      },
    },
    { status: 200 },
  );
});
