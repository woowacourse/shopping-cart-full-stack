import { validateIsNotEmpty, validateLengthRange } from "../validators.js";

describe("validators 테스트", () => {
  test("필수 필드를 누락되었을때 에러가 반환된다.", () => {
    expect(() => {
      validateIsNotEmpty("");
    }).toThrow("필수 필드가 누락되었습니다.");
  });

  test("범위내 길이를 만족하지 않으면 에러가 반환된다.", () => {
    expect(() => {
      validateLengthRange("helloworld", 0, 5);
    }).toThrow("0 이상 5 이하여야 합니다.");
  });
});
