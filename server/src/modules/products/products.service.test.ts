import { addProductQuery, getAllProductsQuery } from "./products.repository";
import { addProduct, getAllProducts } from "./products.service";

jest.mock("./products.repository");

const getAllProductsQueryMock = jest.mocked(getAllProductsQuery);
const addProductQueryMock = jest.mocked(addProductQuery);

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
      expect(() => addProduct(invalidProduct)).toThrow(
        "price는 0보다 큰 정수여아 합니다."
      );
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("price가 음수이면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = { name: "상품1", price: -100, image: "" };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow(
        "price는 0보다 큰 정수여아 합니다."
      );
      expect(addProductQueryMock).not.toHaveBeenCalled();
    });

    it("name이 빈 문자열이면 에러를 던지고 저장하지 않는다.", () => {
      // given
      const invalidProduct = { name: "", price: 1000, image: "" };

      // when & then
      expect(() => addProduct(invalidProduct)).toThrow(
        "상품명은 1자 이상이여야 합니다."
      );
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
      expect(() => addProduct(invalidProduct)).toThrow(
        "상품명은 100자 이하여야 합니다."
      );
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
      addProductQueryMock.mockReturnValue(savedProduct);

      // when
      const result = addProduct(newProduct);

      // then
      expect(addProductQueryMock).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(savedProduct);
    });
  });
});
