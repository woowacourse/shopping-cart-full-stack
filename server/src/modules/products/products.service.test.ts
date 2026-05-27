import { getAllProductsQuery } from "./products.repository";
import { getAllProducts } from "./products.service";

jest.mock("./products.repository");

const getAllProductsQueryMock = jest.mocked(getAllProductsQuery);

describe("products", () => {
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
});
