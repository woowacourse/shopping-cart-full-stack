import ERROR_CODES from "@/ERROR_CODE";
import { validateCartQuantity } from "./carts.validator";

describe("carts.validator", () => {
  describe("validateCartQuantity", () => {
    it("수량이 1이면 통과한다.", () => {
      expect(() => validateCartQuantity(1)).not.toThrow();
    });

    it("수량이 99이면 통과한다.", () => {
      expect(() => validateCartQuantity(99)).not.toThrow();
    });

    it("수량이 50이면 통과한다.", () => {
      expect(() => validateCartQuantity(50)).not.toThrow();
    });

    it("수량이 0이면 OUT_OF_RANGE_CARTS_QUANTITY 에러를 던진다.", () => {
      expect(() => validateCartQuantity(0)).toThrow(
        ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code,
      );
    });

    it("수량이 음수이면 OUT_OF_RANGE_CARTS_QUANTITY 에러를 던진다.", () => {
      expect(() => validateCartQuantity(-1)).toThrow(
        ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code,
      );
    });

    it("수량이 100이면 OUT_OF_RANGE_CARTS_QUANTITY 에러를 던진다.", () => {
      expect(() => validateCartQuantity(100)).toThrow(
        ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code,
      );
    });
  });
});
