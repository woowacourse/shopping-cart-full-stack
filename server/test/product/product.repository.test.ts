import { type InMemoryDB } from "../../src/db/in-memory-db.js";
import InMemoryProductRepository from "../../src/features/product/product.repository.js";
import { VALID_PRODUCT_A } from "../mock-data/product.mock.js";

const testDB = (): InMemoryDB => ({
  PRODUCT_TABLE: [],
  CART_TABLE: [],
});

describe("InMemoryProductRepository", () => {
  let db: InMemoryDB;
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    db = testDB();
    repository = new InMemoryProductRepository(db);
  });

  describe("save", () => {
    it("상품을 저장하고 저장된 데이터를 반환한다", async () => {
      const product = VALID_PRODUCT_A;

      const saved = await repository.save(product);

      expect(saved.id).toBeDefined();
      expect(saved.name).toBe(product.name);
      expect(saved.price).toBe(product.price);
    });
  });

  describe("findAll", () => {
    it("저장된 상품 전체를 반환한다", async () => {
      await repository.save(VALID_PRODUCT_A);
      await repository.save(VALID_PRODUCT_A);

      const products = await repository.findAll();

      expect(products).toHaveLength(2);
    });

    it("저장된 상품이 없으면 빈 배열을 반환한다", async () => {
      const products = await repository.findAll();
      expect(products).toEqual([]);
    });
  });

  describe("findById", () => {
    it("id로 상품을 찾는다", async () => {
      const saved = await repository.save(VALID_PRODUCT_A);
      const found = await repository.findById(saved.id);

      expect(found).toEqual(saved);
    });

    it("해당 id의 상품이 없으면 undefined를 반환한다", async () => {
      const found = await repository.findById(999);
      expect(found).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("상품을 삭제한다", async () => {
      const saved = await repository.save(VALID_PRODUCT_A);
      await repository.remove(saved.id);

      const found = await repository.findById(saved.id);
      expect(found).toBeUndefined();
    });
  });
});
