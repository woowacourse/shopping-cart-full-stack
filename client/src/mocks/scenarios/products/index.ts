import { http, HttpResponse, delay } from "msw";
import { products } from "@/mocks/datas/products";

export const productsScenarios = {
  getSuccess: http.get("/api/products", () => {
    return HttpResponse.json(
      { status: 200, data: products },
      { status: 200 },
    );
  }),

  getEmpty: http.get("/api/products", () => {
    return HttpResponse.json(
      { status: 200, data: [] },
      { status: 200 },
    );
  }),

  getError: http.get("/api/products", () => {
    return HttpResponse.json(
      { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
      { status: 500 },
    );
  }),

  getNetworkError: http.get("/api/products", () => {
    return HttpResponse.error();
  }),

  getDelayed: (ms = 3000) =>
    http.get("/api/products", async () => {
      await delay(ms);
      return HttpResponse.json(
        { status: 200, data: products },
        { status: 200 },
      );
    }),

  postSuccess: http.post("/api/products", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        status: 201,
        data: { id: Date.now(), ...(body as object) },
      },
      { status: 201 },
    );
  }),

  postMissingField: http.post("/api/products", () => {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "필수값이 누락되었습니다.",
        data: [{ type: "price", errorCode: "MISSING_FIELD_PRICE" }],
      },
      { status: 400 },
    );
  }),

  postTypeMismatch: http.post("/api/products", () => {
    return HttpResponse.json(
      { status: 400, errorCode: "TYPE_MISMATCH", errorMessage: "타입이 일치하지 않습니다." },
      { status: 400 },
    );
  }),

  postInvalidRule: http.post("/api/products", () => {
    return HttpResponse.json(
      {
        status: 400,
        errorCode: "INVALID",
        errorMessage: "도메인 규칙에 맞지 않는 값입니다.",
        data: [{ type: "price", errorCode: "INVALID_PRICE" }],
      },
      { status: 400 },
    );
  }),

  postError: http.post("/api/products", () => {
    return HttpResponse.json(
      { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
      { status: 500 },
    );
  }),

  deleteSuccess: http.delete("/api/products/:id", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  deleteNotFound: http.delete("/api/products/:id", () => {
    return HttpResponse.json(
      { status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: "id에 해당하는 상품이 존재하지 않습니다." },
      { status: 404 },
    );
  }),

  deleteError: http.delete("/api/products/:id", () => {
    return HttpResponse.json(
      { status: 500, errorCode: "SERVER_ERROR", errorMessage: "서버에서 오류가 발생했습니다." },
      { status: 500 },
    );
  }),
};
