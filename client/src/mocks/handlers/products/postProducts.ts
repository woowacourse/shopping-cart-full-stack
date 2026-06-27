import { http, HttpResponse } from "msw";
import type { ServerProduct } from "@/apis/carts/dto";

export const postProducts = http.post<never, Partial<ServerProduct>>(
  "/api/products",
  async ({ request }) => {
    const body = await request.json();

    const requiredFields = ["price", "name", "imgUrl"] as const;
    const missingFields = requiredFields.filter((field) => body[field] === undefined);

    if (missingFields.length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          errorCode: "MISSING_FIELD",
          errorMessage: "필수값이 누락되었습니다.",
          data: missingFields.map((field) => ({
            type: field,
            errorCode: `MISSING_FIELD_${field.toUpperCase()}`,
          })),
        },
        { status: 400 },
      );
    }

    const isTypeMismatch = requiredFields.some((field) => {
      if (field === "price") return typeof body[field] !== "number";
      return typeof body[field] !== "string";
    });

    if (isTypeMismatch) {
      return HttpResponse.json(
        {
          status: 400,
          errorCode: "TYPE_MISMATCH",
          errorMessage: "타입이 일치하지 않습니다.",
        },
        { status: 400 },
      );
    }

    const invalidFields = [
      {
        type: "price",
        isInvalid: body.price! <= 0,
      },
      {
        type: "name",
        isInvalid: body.name!.length > 100,
      },
    ].filter(({ isInvalid }) => isInvalid);

    if (invalidFields.length > 0) {
      return HttpResponse.json(
        {
          status: 400,
          errorCode: "INVALID",
          errorMessage: "도메인 규칙에 맞지 않는 값입니다.",
          data: invalidFields.map(({ type }) => ({
            type,
            errorCode: `INVALID_${type.toUpperCase()}`,
          })),
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: 201,
        data: {
          ...(body as ServerProduct),
          id: Date.now(),
        },
      },
      { status: 201 },
    );
  },
);
