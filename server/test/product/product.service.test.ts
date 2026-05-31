import { jest } from "@jest/globals";
import ProductService from "../../src/features/product/product.service.js";
import { ProductNotFoundError } from "../../src/features/product/product.error.js";
import { type ProductRepository } from "../../src/features/product/product.repository.js";
import { type ProductEntity } from "../../src/features/product/product.entity.js";
import { DEFAULT_IMAGE } from "../../src/assets/config.js";

const VALID_PRODUCT_LIST = [
  { id: 1, name: "상품A", price: 1000, imgUrl: DEFAULT_IMAGE },
  { id: 2, name: "상품B", price: 2000, imgUrl: DEFAULT_IMAGE },
  { id: 3, name: "상품C", price: 3000, imgUrl: DEFAULT_IMAGE },
];

describe("ProductService", () => {
  let repository: any;
  let service: ProductService;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    service = new ProductService(repository as ProductRepository);
  });

  describe("register", () => {
    it("상품을 저장한다", async () => {
      const props = {
        name: "상품A",
        price: 1000,
      };

      repository.save.mockResolvedValue({
        id: 1,
        ...props,
        imgUrl: DEFAULT_IMAGE,
      });

      await service.register(props);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("모든 상품을 가져올 수 있다", async () => {
      repository.findAll.mockResolvedValue(VALID_PRODUCT_LIST);

      const products = await service.getAll();

      expect(products.map((p) => p.id)).toEqual([1, 2, 3]);
    });
  });

  describe("getById", () => {
    it("상품이 없으면 ProductNotFoundError를 던진다", async () => {
      repository.findById.mockResolvedValue(undefined);

      await expect(service.getById(1)).rejects.toThrow(ProductNotFoundError);
    });

    it("상품이 있으면 반환한다", async () => {
      const product: ProductEntity = { id: 1, name: "A", price: 1000, imgUrl: DEFAULT_IMAGE };

      repository.findById.mockResolvedValue(product);

      await expect(service.getById(1)).resolves.toEqual(product);
    });
  });

  describe("delete", () => {
    it("상품 삭제를 repository에 위임한다", async () => {
      repository.remove.mockResolvedValue(undefined);

      await service.delete(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});
