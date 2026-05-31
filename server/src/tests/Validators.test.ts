import {
  validateIsNotEmpty,
  validateLengthRange,
  validateMinNumber,
  validateNumberRange,
} from "../validators.js";

describe("validators 테스트", () => {
  describe("빈문자 검증 테스트", () => {
    const validator = validateIsNotEmpty("상품명");
    test.each(["", null, undefined])(
      "필수 필드를 누락했을때 에러가 반환된다.",
      (value: any) => {
        expect(() => validator(value)).toThrow("상품명 필드가 누락되었습니다.");
      },
    );

    test.each(["치킨", "햄버123거", "00000", "!{}{<>>"])(
      "필수 필드에 값이 전달되면 에러가 발생하지 않는다.",
      (value) => {
        expect(() => validator(value)).not.toThrow();
      },
    );
  });

  describe("범위내 길이를 만족하지 않는 값 검증 테스트", () => {
    const validator = validateLengthRange("상품명", 1, 5);
    test.each(["", "민트초코치킨"])(
      "문자의 길이가 범위내를 벗어나면 에러가 반환된다.",
      (value) => {
        expect(() => validator(value)).toThrow(
          "상품명은 1 이상 5 이하여야 합니다.",
        );
      },
    );

    test("문자의 길이가 범위내를 만족하면 에러가 발생하지 않는다", () => {
      expect(() => validator("민트초코")).not.toThrow();
    });
  });

  describe("지정된 최소값보다 큰 값인지 검증 테스트", () => {
    const validator = validateMinNumber("가격", 20000);
    test.each([19999, 20000])(
      "최솟값 이하의 값이면 에러가 반환된다.",
      (value) => {
        expect(() => validator(value)).toThrow(
          "가격은 20000 보다 큰 숫자여야 합니다.",
        );
      },
    );

    test("최솟값보다 큰 값이면 에러가 발생하지 않는다.", () => {
      expect(() => validator(20001)).not.toThrow();
    });
  });

  describe("숫자 범위 검증 테스트", () => {
    const validator = validateNumberRange("수량", 1, 99);
    test.each([0, 100])("범위를 벗어난 값이면 에러가 반환된다.", (value) => {
      expect(() => validator(value)).toThrow(
        "수량은 1 이상 99 이하여야 합니다.",
      );
    });

    test.each([1, 99])("범위의 경계값이면 에러가 발생하지 않는다.", (value) => {
      expect(() => validator(value)).not.toThrow();
    });
  });
});
