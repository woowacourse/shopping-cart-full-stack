export function validateIsNotEmpty(value: string) {
  if (value === "") throw new Error("필수 필드가 누락되었습니다.");
}

export function validateLengthRange(value: string, min: number, max: number) {
  if (min > value.length || value.length > max) {
    throw new Error(`${min} 이상 ${max} 이하여야 합니다.`);
  }
}
