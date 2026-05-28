import type { ProductResponse } from "./products.dto.ts";
import * as productsRepository from "./products.repository.ts";
import { ServiceError } from "../../common/error.ts";
import type { ProductRequest } from "./products.dto.ts";
import { getMissingFields } from "../../validate/getMissingFields.ts";

export const getProducts = (): ProductResponse[] => {
  return productsRepository.findAll().map((product) => ({
    id: product.id,
    price: product.price,
    name: product.name,
    imgUrl: product.imgUrl,
  }));
};

export const createProduct = (productRequest: Partial<ProductRequest>) => {
  // 필수값 검증
  const requiredFields = ["price", "name", "imgUrl"] as const;
  const missingFields = getMissingFields(
    productRequest,
    requiredFields as unknown as string[],
  );

  if (missingFields.length > 0) {
    throw new ServiceError(
      "MISSING_FIELD",
      "필수값이 누락되었습니다.",
      missingFields.map((field) => ({
        type: field,
        errorCode: `MISSING_FIELD_${field.toUpperCase()}`,
      })),
    );
  }

  // 타입 검증
  const isTypeMismatch = requiredFields.some((field) => {
    if (field === "price") return typeof productRequest[field] !== "number";

    return typeof productRequest[field] !== "string";
  });

  if (isTypeMismatch) {
    throw new ServiceError("TYPE_MISMATCH", "타입이 일치하지 않습니다.");
  }

  // 도메인 규칙 검증
  const invalidFields = [
    {
      type: "price",
      isInvalid: productRequest.price! <= 0,
    },
    {
      type: "name",
      isInvalid: productRequest.name!.length > 100,
    },
  ].filter(({ isInvalid }) => isInvalid);

  if (invalidFields.length > 0) {
    throw new ServiceError(
      "INVALID",
      "도메인 규칙에 맞지 않는 값입니다.",
      invalidFields.map(({ type }) => ({
        type,
        errorCode: `INVALID_${type.toUpperCase()}`,
      })),
    );
  }

  const product = productsRepository.create(productRequest as ProductRequest);

  return product;
};

export const deleteProduct = (id: number) => {
  const product = productsRepository.findById(id);

  if (!product) {
    throw new ServiceError(
      "RESOURCE_NOT_FOUND",
      "id에 해당하는 상품이 존재하지 않습니다.",
    );
  }

  productsRepository.deleteById(id);
};
