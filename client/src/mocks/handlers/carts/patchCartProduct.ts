import { http, HttpResponse } from "msw";
import { cart } from "@/mocks/datas/carts";

export const patchCartProduct = http.patch<
  { cartId: string; productId: string },
  { quantity?: any }
>("/api/carts/:cartId/products/:productId", async ({ params, request }) => {
  const { productId } = params;
  const body = await request.json();

  if (body.quantity === undefined) {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [{ type: "quantity", errorCode: "MISSING_FIELD_QUANTITY" }],
      },
      { status: 400 },
    );
  }

  if (typeof body.quantity !== "number") {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "TYPE_MISMATCH",
        errorMessage: "타입이 일치하지 않습니다.",
      },
      { status: 400 },
    );
  }

  if (!Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 99) {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "INVALID",
        errorMessage: "도메인 규칙에 맞지 않는 값입니다.",
        data: [{ type: "quantity", errorCode: "INVALID_QUANTITY" }],
      },
      { status: 400 },
    );
  }

  const product = cart.products.find((p) => p.id === Number(productId));

  if (!product) {
    return HttpResponse.json(
      {
        status: 404,
        errorCode: "RESOURCE_NOT_FOUND",
        errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다.",
      },
      { status: 404 },
    );
  }

  // Mutate state for tests
  product.quantity = body.quantity;

  return HttpResponse.json(
    {
      status: 200,
      data: product,
    },
    { status: 200 },
  );
});
