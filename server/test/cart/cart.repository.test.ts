import { type InMemoryDB } from "../../src/db/in-memory-db.js";
import InMemoryCartRepository from "../../src/features/cart/cart.repository.js";

const testDB = (): InMemoryDB => ({
  PRODUCT_TABLE: [],
  CART_TABLE: [],
});

describe("InMemoryCartRepository", () => {
  let db: InMemoryDB;
  let repository: InMemoryCartRepository;

  beforeEach(() => {
    db = testDB();
    repository = new InMemoryCartRepository(db);
  });

  describe("save", () => {
    it("장바구니 항목을 저장하고 저장된 데이터를 반환한다", async () => {
      const cartItem = { product_id: 1, quantity: 2 };

      const saved = await repository.save(cartItem);

      expect(saved.product_id).toBe(1);
      expect(saved.quantity).toBe(2);
    });

    it("이미 존재하는 상품인 경우 수량을 갱신한다", async () => {
      await repository.save({ product_id: 1, quantity: 2 });

      const cartItem2 = { product_id: 1, quantity: 5 };
      const saved = await repository.save(cartItem2);

      expect(saved.quantity).toBe(5);
      expect(db.CART_TABLE).toHaveLength(1);
    });
  });

  describe("findAll", () => {
    it("장바구니 전체 항목을 반환한다", async () => {
      await repository.save({ product_id: 1, quantity: 2 });
      await repository.save({ product_id: 2, quantity: 3 });

      const items = await repository.findAll();

      expect(items).toHaveLength(2);
    });
  });

  describe("findByProductId", () => {
    it("상품 ID로 장바구니 항목을 찾는다", async () => {
      const cartItem = { product_id: 1, quantity: 2 };
      await repository.save(cartItem);
      const found = await repository.findByProductId(1);

      expect(found).toEqual(cartItem);
    });

    it("항목이 없으면 undefined를 반환한다", async () => {
      const found = await repository.findByProductId(999);
      expect(found).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("상품 ID에 해당하는 장바구니 항목을 삭제한다", async () => {
      await repository.save({ product_id: 1, quantity: 2 });
      await repository.remove(1);

      const found = await repository.findByProductId(1);
      expect(found).toBeUndefined();
    });
  });
});
