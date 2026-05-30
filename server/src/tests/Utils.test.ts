import { FieldError } from "../errors.js";
import { runValidate } from "../utils.js";

function validateIsBlank(label: string) {
  return function validate(value: string) {
    if (value !== "") {
      throw new FieldError({
        code: "REQUIRED_BLANK",
        message: `${label}필드는 공백이여야 합니다.`,
      });
    }
  };
}

describe("유틸 테스트", () => {
  test("runValidate", () => {
    const validators = {
      name: [validateIsBlank("이름")],
      age: [validateIsBlank("나이")],
    };
    const errors = runValidate(validators, { name: "안톨리니", age: "27" });
    expect(errors).toEqual({
      name: {
        code: "REQUIRED_BLANK",
        message: "이름필드는 공백이여야 합니다.",
      },
      age: {
        code: "REQUIRED_BLANK",
        message: "나이필드는 공백이여야 합니다.",
      },
    });
  });
});
