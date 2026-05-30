import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductByIdQuery,
  getProductByNameQuery,
} from "./products.repository";
import { removeCartItemByProductId } from "../carts/carts.service";
import { addProduct, deleteProduct, getAllProducts } from "./products.service";
import ERROR_CODES from "../../ERROR_CODE";

jest.mock("./products.repository");
jest.mock("../carts/carts.service");

const getAllProductsQueryMock = jest.mocked(getAllProductsQuery);
const addProductQueryMock = jest.mocked(addProductQuery);
const getProductByNameQueryMock = jest.mocked(getProductByNameQuery);
const getProductByIdQueryMock = jest.mocked(getProductByIdQuery);
const deleteProductQueryMock = jest.mocked(deleteProductQuery);
const removeCartItemByProductIdMock = jest.mocked(removeCartItemByProductId);

describe("products", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("등록된 모든 상품을 반환한다.", () => {
      // given
      const mockProducts = [
        { id: 1, name: "상품1", price: 1000, image: "" },
        { id: 2, name: "상품2", price: 2000, image: "" },
      ];
      getAllProductsQueryMock.mockReturnValue(mockProducts);

      // when
      const products = getAllProducts();

      // then
      expect(products).toEqual(mockProducts);
    });
  });

  describe("addProduct", () => {
    it("유효한 상품을 전달하면 저장된 상품을 반환한다.", () => {
      // given
      const newProduct = { name: "상품1", price: 1000, image: "" };
      const savedProduct = { id: 1, ...newProduct };
      getProductByNameQueryMock.mockReturnValue(undefined);
      addProductQueryMock.mockReturnValue(savedProduct);

      // when
      const result = addProduct(newProduct);

      // then
      expect(addProductQueryMock).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(savedProduct);
    });

    it("price가 0 이하이면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = { name: "상품1", price: 0, image: "" };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow();
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("price가 음수이면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = { name: "상품1", price: -100, image: "" };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow();
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("name이 빈 문자열이면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = { name: "", price: 1000, image: "" };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow();
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("name이 100자를 초과하면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = {
        name: "a".repeat(101),
        price: 1000,
        image: "",
      };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow();
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("name이 정확히 100자이면 정상적으로 저장된다.", () => {
      // given
      const newProduct = {
        name: "a".repeat(100),
        price: 1000,
        image: "",
      };
      const savedProduct = { id: 1, ...newProduct };
      getProductByNameQueryMock.mockReturnValue(undefined);
      addProductQueryMock.mockReturnValue(savedProduct);

      // when
      const result = addProduct(newProduct);

      // then
      expect(addProductQueryMock).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(savedProduct);
    });

    it("이미 존재하는 이름의 상품을 추가하면 DUPLICATE_PRODUCT_NAME 에러를 던지고 저장하지 않는다.", () => {
      // given
      const newProduct = { name: "상품1", price: 1000, image: "" };
      getProductByNameQueryMock.mockReturnValue({ id: 1, ...newProduct });

      // when & then
      expect(() => addProduct(newProduct)).toThrow();
      expect(getProductByNameQueryMock).toHaveBeenCalledWith(newProduct.name);
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });
  });

  describe("deleteProduct", () => {
    it("존재하지 않는 상품을 삭제하려 하면 NOT_EXIST_PRODUCT 에러를 던지고 삭제하지 않는다.", () => {
      // given
      getProductByIdQueryMock.mockReturnValue(undefined);

      // when & then
      expect(() => deleteProduct(1)).toThrow(
        ERROR_CODES.NOT_EXIST_PRODUCT.message,
      );
      expect(deleteProductQueryMock).not.toHaveBeenCalled();
      expect(removeCartItemByProductIdMock).not.toHaveBeenCalled();
    });

    it("존재하는 상품을 삭제하면 해당 id를 반환한다.", () => {
      // given
      const product = { id: 1, name: "상품1", price: 1000, image: "" };
      getProductByIdQueryMock.mockReturnValue(product);

      // when
      const result = deleteProduct(product.id);

      // then
      expect(deleteProductQueryMock).toHaveBeenCalledWith(product.id);
      expect(result).toBe(product.id);
    });

    it("존재하는 상품을 삭제하면 연관 장바구니 항목 제거를 carts 서비스에 위임한다.", () => {
      // given
      const product = { id: 1, name: "상품1", price: 1000, image: "" };
      getProductByIdQueryMock.mockReturnValue(product);

      // when
      deleteProduct(product.id);

      // then
      expect(removeCartItemByProductIdMock).toHaveBeenCalledWith(product.id);
    });
  });
});
