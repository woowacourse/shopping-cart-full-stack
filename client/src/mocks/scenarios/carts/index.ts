import { http, HttpResponse, delay } from "msw";
import { cart, cartProducts } from "@/mocks/datas/carts";

export const cartsScenarios = {
  getSuccess: http.get("/api/carts/:cartId", ({ params }) => {
    return HttpResponse.json(
      {
        status: 200,
        data: { ...cart, id: Number(params.cartId) },
      },
      { status: 200 },
    );
  }),

  getEmpty: http.get("/api/carts/:cartId", ({ params }) => {
    return HttpResponse.json(
      {
        status: 200,
        data: { id: Number(params.cartId), products: [] },
      },
      { status: 200 },
    );
  }),

  getNotFound: http.get("/api/carts/:cartId", () => {
    return HttpResponse.json(
      { status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: "id에 해당하는 장바구니가 존재하지 않습니다." },
      { status: 404 },
    );
  }),

  getError: http.get("/api/carts/:cartId", () => {
    return HttpResponse.json(
      { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
      { status: 500 },
    );
  }),

  getNetworkError: http.get("/api/carts/:cartId", () => {
    return HttpResponse.error();
  }),

  getDelayed: (ms = 3000) =>
    http.get("/api/carts/:cartId", async ({ params }) => {
      await delay(ms);
      return HttpResponse.json(
        {
          status: 200,
          data: { ...cart, id: Number(params.cartId) },
        },
        { status: 200 },
      );
    }),

  patchSuccess: http.patch(
    "/api/carts/:cartId/products/:productId",
    async ({ params, request }) => {
      const { productId } = params;
      const body = (await request.json()) as { quantity: number };
      const product = cartProducts.find((p) => p.id === Number(productId));

      return HttpResponse.json(
        {
          status: 200,
          data: { ...product, quantity: body.quantity },
        },
        { status: 200 },
      );
    },
  ),

  patchMissingField: http.patch(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        {
          status: 400,
          errorCode: "MISSING_FIELD",
          errorMessage: "필수값이 누락되었습니다.",
          data: [{ type: "quantity", errorCode: "MISSING_FIELD_QUANTITY" }],
        },
        { status: 400 },
      );
    },
  ),

  patchTypeMismatch: http.patch(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        { status: 400, errorCode: "TYPE_MISMATCH", errorMessage: "타입이 일치하지 않습니다." },
        { status: 400 },
      );
    },
  ),

  patchInvalidRule: http.patch(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        {
          status: 400,
          errorCode: "INVALID",
          errorMessage: "도메인 규칙에 맞지 않는 값입니다.",
          data: [{ type: "quantity", errorCode: "INVALID_QUANTITY" }],
        },
        { status: 400 },
      );
    },
  ),

  patchNotFound: http.patch(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        { status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다." },
        { status: 404 },
      );
    },
  ),

  patchError: http.patch(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
        { status: 500 },
      );
    },
  ),

  deleteSuccess: http.delete(
    "/api/carts/:cartId/products/:productId",
    () => {
      return new HttpResponse(null, { status: 204 });
    },
  ),

  deleteNotFound: http.delete(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        { status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: "id에 해당하는 장바구니 상품이 존재하지 않습니다." },
        { status: 404 },
      );
    },
  ),

  deleteError: http.delete(
    "/api/carts/:cartId/products/:productId",
    () => {
      return HttpResponse.json(
        { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
        { status: 500 },
      );
    },
  ),
};
