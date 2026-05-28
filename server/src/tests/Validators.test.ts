import { isNotEmpty } from "../validators.js";

describe("validators 테스트", () => {
  test("필수 필드를 누락되었을때 에러가 반환된다.", () => {
    expect(() => {
      isNotEmpty("");
    }).toThrow("필수 필드가 누락되었습니다.");
  });
});
