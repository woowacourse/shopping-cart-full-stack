import { getCartsQuery } from "./carts.repository";
import { getCarts } from "./carts.service";

jest.mock("./carts.repository");

const getCartQueryMock = jest.mocked(getCartsQuery);

describe("carts", () => {
  describe("getCart", () => {
    it("장바구니 상품을 반환한다", () => {
      // given
      const mockCart = [1, 2, 3, 4, 5];
      getCartQueryMock.mockReturnValue(mockCart);

      // when
      const cart = getCarts();

      // then
      expect(cart).toEqual(mockCart);
    });
  });
});
