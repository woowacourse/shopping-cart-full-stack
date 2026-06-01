import { jest } from "@jest/globals";

const loadCartService = async () => {
  jest.resetModules();
  const cartServiceModule = await import("./CartService.js");
  const httpErrorsModule = await import("../errors/HttpError.js");
  const dbModule = await import("../db.js");

  return {
    cartService: cartServiceModule.cartService,
    cartItems: dbModule.cartItems,
    InvalidInputError: httpErrorsModule.InvalidInputError,
    NotFoundError: httpErrorsModule.NotFoundError,
  };
};

describe("cartService", () => {
  test("getCartItems는 장바구니 항목 목록을 반환한다", async () => {
    const { cartService } = await loadCartService();

    expect(cartService.getCartItems()).toHaveLength(3);
  });

  test("updateQuantity는 수량을 변경하고 변경된 수량을 반환한다", async () => {
    const { cartService } = await loadCartService();

    const quantity = cartService.updateQuantity("1", { quantity: 3 });

    expect(quantity).toBe(3);
    expect(
      cartService
        .getCartItems()
        .find((item) => item.id === "1")
        ?.getQuantity(),
    ).toBe(3);
  });

  describe("updateQuantity는 유효하지 않은 요청이면 InvalidInputError를 던진다", () => {
    const invalidCases: Array<[string, unknown]> = [
      ["quantity가 0", { quantity: 0 }],
      ["quantity가 최솟값 미만(음수)", { quantity: -1 }],
      ["quantity가 최댓값 초과(100)", { quantity: 100 }],
      ["quantity가 정수가 아닌 소수", { quantity: 1.5 }],
      ["quantity가 문자열", { quantity: "3" }],
      ["quantity 필드가 누락", {}],
      ["body가 null", null],
      ["body가 객체가 아닌 값", "3"],
    ];

    test.each(invalidCases)(
      "%s이면 InvalidInputError를 던진다",
      async (_label, body) => {
        const { cartService, InvalidInputError } = await loadCartService();

        expect(() => cartService.updateQuantity("1", body)).toThrow(
          InvalidInputError,
        );
      },
    );
  });

  test("updateQuantity는 없는 항목이면 NotFoundError를 던진다", async () => {
    const { cartService, NotFoundError } = await loadCartService();

    expect(() => cartService.updateQuantity("999", { quantity: 3 })).toThrow(
      NotFoundError,
    );
  });

  test("deleteCartItem은 장바구니 항목을 삭제한다", async () => {
    const { cartService } = await loadCartService();

    cartService.deleteCartItem("1");

    expect(cartService.getCartItems()).toHaveLength(2);
    expect(cartService.getCartItems().some((item) => item.id === "1")).toBe(
      false,
    );
  });

  test("deleteCartItem은 없는 항목이면 NotFoundError를 던진다", async () => {
    const { cartService, NotFoundError } = await loadCartService();

    expect(() => cartService.deleteCartItem("999")).toThrow(NotFoundError);
  });
});
