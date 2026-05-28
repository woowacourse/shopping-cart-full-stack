import {
  validateIsNotEmpty,
  validateLengthRange,
  validateMinNumber,
} from "../validators.js";

describe("validators 테스트", () => {
  test("필수 필드를 누락되었을때 에러가 반환된다.", () => {
    const validator = validateIsNotEmpty("상품명");
    expect(() => {
      validator("");
    }).toThrow("상품명 필드가 누락되었습니다.");
  });

  test("범위내 길이를 만족하지 않으면 에러가 반환된다.", () => {
    const validator = validateLengthRange("상품명", 0, 5);
    expect(() => {
      validator("helloworld");
    }).toThrow("상품명은 0 이상 5 이하여야 합니다.");
  });

  test("최소숫자보다 낮으면 에러가 반환된다.", () => {
    const validator = validateMinNumber("가격", 20000);
    expect(() => {
      validator(10000);
    }).toThrow("가격은 20000 보다 큰 숫자여야 합니다.");
  });
});
