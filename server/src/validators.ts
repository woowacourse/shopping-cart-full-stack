import { ValidatorMap } from "./utils.js";
import { FieldError } from "./errors.js";

export const ProductFieldValidators: ValidatorMap = {
  name: [validateIsNotEmpty("상품명"), validateLengthRange("상품명", 0, 100)],
  price: [validateIsNotEmpty("가격"), validateMinNumber("가격", 0)],
};

export const CartFieldValidators: ValidatorMap = {
  quantity: [validateNumberRange("수량", 0, 100)],
};

export function validateIsNotEmpty(label: string) {
  return function validate(value: string) {
    if (!!value === false)
      throw new FieldError({
        code: "REQUIRED_FIELD",
        message: `${label} 필드가 누락되었습니다.`,
      });
  };
}

export function validateLengthRange(label: string, min: number, max: number) {
  return function validate(value: string) {
    if (min > value.length || value.length > max) {
      throw new FieldError({
        code: "INVALID_LENGTH_RANGE",
        message: `${label}은 ${min} 이상 ${max} 이하여야 합니다.`,
      });
    }
  };
}

export function validateMinNumber(label: string, min: number) {
  return function validate(value: number) {
    if (value <= min) {
      throw new FieldError({
        code: "INVALID_MIN_NUMBER",
        message: `${label}은 ${min} 보다 큰 숫자여야 합니다.`,
      });
    }
  };
}

export function validateNumberRange(label: string, min: number, max: number) {
  return function validate(value: number) {
    if (min > value || value > max) {
      throw new FieldError({
        code: "INVALID_NUMBER_RANGE",
        message: `${label}은 ${min} 이상 ${max} 이하여야 합니다.`,
      });
    }
  };
}
