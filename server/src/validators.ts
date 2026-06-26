import { FieldError } from "./errors.js";

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
        message: `${label}은 ${min}자 이상 ${max}자 이하 문자여야 합니다.`,
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

export function validateMaxArrayLength(label: string, max: number) {
  return function validate(value: unknown) {
    if (!Array.isArray(value)) return;
    if (value.length > max) {
      throw new FieldError({
        code: "EXCEED_MAX_COUNT",
        message: `${label}은 최대 ${max}개까지 선택할 수 있습니다.`,
      });
    }
  };
}
