import { http, HttpResponse } from "msw";
import { createId, db } from "./db";
import { ERROR_CODES, MockAppError, withErrorHandling } from "./errors";

const API = "/api/products";

// server products.schema.validateProduct (type 검증)
const validateProduct = (body: unknown) => {
  if (
    !!body &&
    typeof body === "object" &&
    "name" in body &&
    "price" in body &&
    "image" in body &&
    typeof body.name === "string" &&
    typeof body.price === "number" &&
    typeof body.image === "string"
  ) {
    return { name: body.name, price: body.price, image: body.image };
  }

  throw new MockAppError(ERROR_CODES.INVALID_PRODUCT);
};

// server products.validator.validateProductRules (비즈니스 검증)
const validateProductRules = (arg: { name: string; price: number }) => {
  if (arg.price <= 0) {
    throw new MockAppError(ERROR_CODES.PRICE_MUST_BE_POSITIVE);
  }
  if (arg.name.length > 100) {
    throw new MockAppError(ERROR_CODES.NAME_TOO_LONG);
  }
  if (arg.name === "") {
    throw new MockAppError(ERROR_CODES.NAME_REQUIRED);
  }
};

// server products.schema.validateID
const validateID = (id: unknown): string => {
  if (!!id && typeof id === "string") return id;
  throw new MockAppError(ERROR_CODES.INVALID_ID);
};

export const productsHandlers = [
  // GET /products
  http.get(
    API,
    withErrorHandling(() =>
      HttpResponse.json({
        status: "success",
        message: "상품 목록을 정상적으로 조회하였습니다.",
        data: [...db.products.values()],
      }),
    ),
  ),

  // POST /products
  http.post(
    API,
    withErrorHandling(async ({ request }) => {
      const body = await request.json().catch(() => ({}));

      const { name, price, image } = validateProduct(body);
      validateProductRules({ name, price });

      const duplicated = [...db.products.values()].some(
        (product) => product.name === name,
      );
      if (duplicated) {
        throw new MockAppError(ERROR_CODES.DUPLICATE_PRODUCT_NAME);
      }

      const product = { id: createId(), name, price, image };
      db.products.set(product.id, product);

      return HttpResponse.json(
        {
          status: "success",
          message: "상품을 정상적으로 등록하였습니다.",
          data: product,
        },
        { status: 201 },
      );
    }),
  ),

  // DELETE /products/:id
  http.delete(
    `${API}/:id`,
    withErrorHandling(({ params }) => {
      const id = validateID(params.id);

      if (!db.products.has(id)) {
        throw new MockAppError(ERROR_CODES.NOT_EXIST_PRODUCT);
      }

      db.products.delete(id);
      // server: 연관 장바구니 항목 정리(removeCartItemByProductId)
      db.carts.delete(id);

      return HttpResponse.json({
        status: "success",
        message: "상품을 정상적으로 삭제하였습니다.",
        data: { id },
      });
    }),
  ),
];
