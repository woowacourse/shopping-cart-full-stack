import type { ProductResponse } from "./products.dto.ts";
import * as productsRepository from "./products.repository.ts";
import { BadRequestError } from "../../common/error.ts";
import type { ProductRequest } from "./products.dto.ts";

export const getProducts = (): ProductResponse[] => {
  return productsRepository.findAll().map((product) => ({
    id: product.id,
    price: product.price,
    name: product.name,
    imgUrl: product.imgUrl,
  }));
};

export const createProduct = (productRequest: Partial<ProductRequest>) => {
  const requiredFields = ["price", "name", "imgUrl"] as const;
  const missingFields = requiredFields.filter(
    (field) => productRequest[field] === undefined,
  );

  if (missingFields.length > 0) {
    throw new BadRequestError(
      "MISSING_FIELD",
      "필수값이 누락되었습니다.",
      missingFields.map((field) => ({
        type: field,
        errorCode: `${field.toUpperCase()}_MISSING_FIELD`,
      })),
    );
  }

  const isTypeMismatch = requiredFields.some((field) => {
    if (field === "price") return typeof productRequest[field] !== "number";

    return typeof productRequest[field] !== "string";
  });

  if (isTypeMismatch) {
    throw new BadRequestError("TYPE_MISMATCH", "타입이 일치하지 않습니다.");
  }

  const product = productsRepository.create(productRequest as ProductRequest);

  return product;
};
