import { ValidatorMap } from "./utils.js";

export const ProductFieldValidators: ValidatorMap = {
  name: [validateIsNotEmpty("상품명"), validateLengthRange("상품명", 0, 100)],
  price: [validateIsNotEmpty("가격"), validateMinNumber("가격", 0)],
};

export function validateIsNotEmpty(label: string) {
  return function validate(value: string) {
    if (value === "") throw new Error(`${label} 필드가 누락되었습니다.`);
  };
}

export function validateLengthRange(label: string, min: number, max: number) {
  return function validate(value: string) {
    if (min > value.length || value.length > max) {
      throw new Error(`${label}은 ${min} 이상 ${max} 이하여야 합니다.`);
    }
  };
}

export function validateMinNumber(label: string, min: number) {
  return function validate(value: number) {
    if (value <= min) {
      throw new Error(`${label}은 ${min} 보다 큰 숫자여야 합니다.`);
    }
  };
}

export function validateNumberRange(label: string, min: number, max: number) {
  return function validate(value: number) {
    if (min > value || value > max) {
      throw new Error(`${label}은 ${min} 이상 ${max} 이하여야 합니다.`);
    }
  };
}
