import { ServiceError } from "../../common/error.ts";
import { getMissingFields } from "../../validate/getMissingFields.ts";

import type { ProductRequest } from "./products.dto.ts";

// createProduct
const createProductValidators = {
  validateRequiredFields(productRequest: Partial<ProductRequest>) {
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
  },
  validateTypes(productRequest: Partial<ProductRequest>) {
    // 타입 검증
    const requiredFields = ["price", "name", "imgUrl"] as const;
    const mismatchFields = requiredFields.filter((field) => {
      if (field === "price") {
        return typeof productRequest[field] !== "number";
      }

      return typeof productRequest[field] !== "string";
    });
    if (mismatchFields.length > 0) {
      throw new ServiceError(
        "TYPE_MISMATCH",
        "타입이 일치하지 않습니다.",
        mismatchFields.map((field) => ({
          type: field,
          errorCode: `TYPE_MISMATCH_${field.toUpperCase()}`,
        })),
      );
    }
  },
  validateDomainRules(productRequest: Partial<ProductRequest>) {
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
  },
};
export const createProduct = (productRequest: Partial<ProductRequest>) => {
  createProductValidators.validateRequiredFields(productRequest);
  createProductValidators.validateTypes(productRequest);
  createProductValidators.validateDomainRules(productRequest);
};
