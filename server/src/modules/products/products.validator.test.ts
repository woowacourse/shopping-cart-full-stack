import { validateProductRules } from "./products.validator";

describe("validateProductRules", () => {
  describe("price 유효성", () => {
    it("price가 양수이면 통과한다.", () => {
      expect(() =>
        validateProductRules({ name: "상품", price: 1, image: "" }),
      ).not.toThrow();
    });

    it("price가 0이면 에러를 던진다.", () => {
      expect(() =>
        validateProductRules({ name: "상품", price: 0, image: "" }),
      ).toThrow();
    });

    it("price가 음수이면 에러를 던진다.", () => {
      expect(() =>
        validateProductRules({ name: "상품", price: -1, image: "" }),
      ).toThrow();
    });
  });

  describe("name 유효성", () => {
    it("name이 1자 이상 100자 이하이면 통과한다.", () => {
      expect(() =>
        validateProductRules({ name: "상", price: 1000, image: "" }),
      ).not.toThrow();
      expect(() =>
        validateProductRules({
          name: "a".repeat(100),
          price: 1000,
          image: "",
        }),
      ).not.toThrow();
    });

    it("name이 빈 문자열이면 에러를 던진다.", () => {
      expect(() =>
        validateProductRules({ name: "", price: 1000, image: "" }),
      ).toThrow();
    });

    it("name이 100자를 초과하면 에러를 던진다.", () => {
      expect(() =>
        validateProductRules({
          name: "a".repeat(101),
          price: 1000,
          image: "",
        }),
      ).toThrow();
    });
  });
});
