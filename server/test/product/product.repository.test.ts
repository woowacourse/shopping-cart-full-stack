import { type InMemoryDB } from "../../src/db/in-memory-db.js";
import InMemoryProductRepository from "../../src/features/product/product.repository.js";

const testDB = (): InMemoryDB => ({
  PRODUCT_TABLE: new Map(),
  CART_TABLE: [],
});

const createProduct = () => ({
  name: "상품이름B",
  price: 25000,
  imgUrl: "https://src.com/image.png",
});

describe("InMemoryProductRepository", () => {
  let db: InMemoryDB;
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    db = testDB();
    repository = new InMemoryProductRepository(db);
  });

  describe("save", () => {
    it("상품을 저장하고 id가 포함된 상품을 반환한다", async () => {
      const product = createProduct();
      const saved = await repository.save(product);

      expect(saved.id).toBeDefined();
      expect(saved.name).toBe(product.name);
      expect(saved.price).toBe(product.price);
    });

    it("저장할 때마다 id가 증가한다", async () => {
      const first = await repository.save(createProduct());
      const second = await repository.save(createProduct());

      expect(second.id).toBe(first.id + 1);
    });
  });

  describe("findAll", () => {
    it("저장된 상품 전체를 반환한다", async () => {
      await repository.save(createProduct());
      await repository.save(createProduct());

      const products = await repository.findAll();
      expect(products).toHaveLength(2);
    });

    it("저장된 상품이 없으면 빈 배열을 반환한다", async () => {
      const products = await repository.findAll();
      expect(products).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("id로 상품을 찾는다", async () => {
      const saved = await repository.save(createProduct());
      const found = await repository.findById(saved.id);

      expect(found.id).toBe(saved.id);
    });

    it("없는 id면 에러를 던진다", async () => {
      await expect(repository.findById(999)).resolves.toThrow();
    });
  });

  describe("remove", () => {
    it("상품을 삭제한다", async () => {
      const saved = await repository.save(createProduct());
      await repository.remove(saved.id);

      await expect(repository.findById(saved.id)).resolves.toThrow();
    });
  });
});
