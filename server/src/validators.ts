export function validateIsNotEmpty(label: string) {
  return function validate(value: string) {
    if (value === "") throw new Error(`${label} 필드가 누락되었습니다.`);
  };
}

export function validateLengthRange(label: string) {
  return function validate(value: string, min: number, max: number) {
    if (min > value.length || value.length > max) {
      throw new Error(`${label}은 ${min} 이상 ${max} 이하여야 합니다.`);
    }
  };
}

export function validateMinNumber(label: string) {
  return function validate(value: number, min: number) {
    if (value <= min) {
      throw new Error(`${label}은 ${min} 보다 큰 숫자여야 합니다.`);
    }
  };
}
