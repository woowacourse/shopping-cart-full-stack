import ERROR_CODES from "@/ERROR_CODE";
import {
  changeCartQuantity,
  deleteCartsProduct,
  getCarts,
} from "./carts.service";
import {
  deleteCartsProductQuery,
  getCartItemByProductIdQuery,
  getCartsQuery,
  updateCartQuantityQuery,
} from "./carts.repository";
import { getProductByIdQuery } from "../products/products.repository";

jest.mock("./carts.repository");
jest.mock("../products/products.repository");

const getCartsQueryMock = jest.mocked(getCartsQuery);
const getCartItemByProductIdQueryMock = jest.mocked(getCartItemByProductIdQuery);
const updateCartQuantityQueryMock = jest.mocked(updateCartQuantityQuery);
const deleteCartsProductQueryMock = jest.mocked(deleteCartsProductQuery);
const getProductByIdQueryMock = jest.mocked(getProductByIdQuery);

describe("carts.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCarts", () => {
    it("저장된 장바구니 목록을 반환한다.", () => {
      // given
      const mockCarts = [
        {
          product: { id: 1, name: "상품1", price: 1000, image: "" },
          quantity: 2,
        },
      ];
      getCartsQueryMock.mockReturnValue(mockCarts);

      // when
      const result = getCarts();

      // then
      expect(result).toEqual(mockCarts);
    });
  });

  describe("changeCartQuantity", () => {
    const product = { id: 1, name: "상품1", price: 1000, image: "" };
    const existingCartItem = { product, quantity: 1 };

    it("유효한 수량으로 변경하면 product와 변경된 quantity를 반환한다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(existingCartItem);
      updateCartQuantityQueryMock.mockReturnValue({ product, quantity: 5 });
      getProductByIdQueryMock.mockReturnValue(product);

      // when
      const result = changeCartQuantity(1, 5);

      // then
      expect(updateCartQuantityQueryMock).toHaveBeenCalledWith(1, 5);
      expect(result).toEqual({ product, quantity: 5 });
    });

    it("수량이 0 이하이면 OUT_OF_RANGE_CARTS_QUANTITY 에러를 던지고 update 쿼리는 호출하지 않는다.", () => {
      // when & then
      expect(() => changeCartQuantity(1, 0)).toThrow(
        ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code,
      );
      expect(updateCartQuantityQueryMock).not.toHaveBeenCalled();
    });

    it("수량이 99를 초과하면 OUT_OF_RANGE_CARTS_QUANTITY 에러를 던지고 update 쿼리는 호출하지 않는다.", () => {
      // when & then
      expect(() => changeCartQuantity(1, 100)).toThrow(
        ERROR_CODES.OUT_OF_RANGE_CARTS_QUANTITY.code,
      );
      expect(updateCartQuantityQueryMock).not.toHaveBeenCalled();
    });

    it("장바구니에 존재하지 않는 상품이면 NOT_EXIST_CARTS_ITEM 에러를 던지고 update 쿼리는 호출하지 않는다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(undefined);

      // when & then
      expect(() => changeCartQuantity(1, 5)).toThrow(
        ERROR_CODES.NOT_EXIST_CARTS_ITEM.code,
      );
      expect(updateCartQuantityQueryMock).not.toHaveBeenCalled();
    });

    it("update 쿼리가 undefined를 반환하면 NOT_EXIST_CARTS_ITEM 에러를 던진다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(existingCartItem);
      updateCartQuantityQueryMock.mockReturnValue(undefined);

      // when & then
      expect(() => changeCartQuantity(1, 5)).toThrow(
        ERROR_CODES.NOT_EXIST_CARTS_ITEM.code,
      );
    });

    it("상품이 존재하지 않으면 NOT_EXIST_PRODUCT 에러를 던진다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(existingCartItem);
      updateCartQuantityQueryMock.mockReturnValue({ product, quantity: 5 });
      getProductByIdQueryMock.mockReturnValue(undefined);

      // when & then
      expect(() => changeCartQuantity(1, 5)).toThrow(
        ERROR_CODES.NOT_EXIST_PRODUCT.code,
      );
    });
  });

  describe("deleteCartsProduct", () => {
    const product = { id: 1, name: "상품1", price: 1000, image: "" };
    const existingCartItem = { product, quantity: 1 };

    it("장바구니에 존재하는 상품이면 삭제 쿼리를 호출하고 결과를 반환한다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(existingCartItem);
      deleteCartsProductQueryMock.mockReturnValue(1);

      // when
      const result = deleteCartsProduct(1);

      // then
      expect(deleteCartsProductQueryMock).toHaveBeenCalledWith(1);
      expect(result).toBe(1);
    });

    it("장바구니에 존재하지 않는 상품이면 NOT_EXIST_CARTS_PRODUCT 에러를 던지고 삭제 쿼리는 호출하지 않는다.", () => {
      // given
      getCartItemByProductIdQueryMock.mockReturnValue(undefined);

      // when & then
      expect(() => deleteCartsProduct(1)).toThrow(
        ERROR_CODES.NOT_EXIST_CARTS_PRODUCT.code,
      );
      expect(deleteCartsProductQueryMock).not.toHaveBeenCalled();
    });
  });
});
