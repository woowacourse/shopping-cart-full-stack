import { http, HttpResponse } from "msw";
import { db } from "./db";
import { ERROR_CODES, MockAppError, withErrorHandling } from "./errors";

const API = "/api/carts";

// server carts.schema.validateID
const validateID = (id: unknown): string => {
  if (!!id && typeof id === "string") return id;
  throw new MockAppError(ERROR_CODES.INVALID_ID);
};

// server carts.schema.validateQuantity (type 검증)
const validateQuantity = (body: unknown): { quantity: number } => {
  if (
    !!body &&
    typeof body === "object" &&
    "quantity" in body &&
    typeof body.quantity === "number"
  ) {
    return { quantity: body.quantity };
  }

  throw new MockAppError(ERROR_CODES.INVALID_CARTS_QUANTITY);
};

export const cartsHandlers = [
  // GET /carts
  http.get(
    API,
    withErrorHandling(() =>
      HttpResponse.json({
        status: "success",
        message: "장바구니를 정상적으로 조회하였습니다.",
        data: [...db.carts.values()],
      }),
    ),
  ),

  // PATCH /carts/:id
  http.patch(
    `${API}/:id`,
    withErrorHandling(async ({ params, request }) => {
      const id = validateID(params.id);
      const { quantity } = validateQuantity(
        await request.json().catch(() => ({})),
      );

      // server CartsService.changeCartQuantity: 수량 범위 검증 → 존재 여부 검증 순서
      if (quantity < 1 || quantity > 99) {
        throw new MockAppError(ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY);
      }

      const cartItem = db.carts.get(id);
      if (!cartItem) {
        throw new MockAppError(ERROR_CODES.NOT_EXIST_CARTS_ITEM);
      }

      cartItem.quantity = quantity;

      return HttpResponse.json({
        status: "success",
        message: "장바구니 상품 수량을 정상적으로 변경하였습니다.",
        data: { product: cartItem.product, quantity: cartItem.quantity },
      });
    }),
  ),

  // DELETE /carts/:id
  http.delete(
    `${API}/:id`,
    withErrorHandling(({ params }) => {
      const id = validateID(params.id);

      if (!db.carts.has(id)) {
        throw new MockAppError(ERROR_CODES.NOT_EXIST_CARTS_PRODUCT);
      }

      db.carts.delete(id);

      return HttpResponse.json({
        status: "success",
        message: "장바구니에서 상품을 정상적으로 제거하였습니다.",
        data: { id },
      });
    }),
  ),
];
