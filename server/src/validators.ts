export function isNotEmpty(value: string) {
  if (value === "") throw new Error("필수 필드가 누락되었습니다.");
}
