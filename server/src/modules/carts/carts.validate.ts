import { ServiceError } from "../../common/error.ts";
import { getMissingFields } from "../../validate/getMissingFields.ts";

import type { CartUpdateOption } from "./carts.service.ts";

// updateCartProduct
const updateCartProductValidators = {
  validateRequiredFields(cartUpdateOption: Partial<CartUpdateOption>) {
    const requiredFields = ["quantity"] as const;
    const missingFields = getMissingFields(
      cartUpdateOption,
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
  validateTypes(cartUpdateOption: Partial<CartUpdateOption>) {
    if (typeof cartUpdateOption.quantity !== "number") {
      throw new ServiceError("TYPE_MISMATCH", "타입이 일치하지 않습니다.", [
        {
          type: "quantity",
          errorCode: `TYPE_MISMATCH_${"quantity".toUpperCase()}`,
        },
      ]);
    }
  },
  validateDomainRules(cartUpdateOption: Partial<CartUpdateOption>) {
    const invalidFields = [
      {
        type: "quantity",
        isInvalid:
          !Number.isInteger(cartUpdateOption.quantity) ||
          cartUpdateOption.quantity! < 1 ||
          cartUpdateOption.quantity! > 99,
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
export const updateCartProduct = (
  cartUpdateOption: Partial<CartUpdateOption>,
) => {
  updateCartProductValidators.validateRequiredFields(cartUpdateOption);
  updateCartProductValidators.validateTypes(cartUpdateOption);
  updateCartProductValidators.validateDomainRules(cartUpdateOption);
};
