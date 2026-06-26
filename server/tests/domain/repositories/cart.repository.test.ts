import {
  saveNewItem,
  findAll,
  findById,
  updateItemQuantity,
  deleteById,
  deleteByProductId,
  isAlreadyExist,
  reset,
} from "../../../src/repositories/cart.repository.js";
import {
  reset as resetProducts,
  save as saveProduct,
  findAll as findProducts,
} from "../../../src/repositories/products.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

// FK 제약을 만족하도록 cart item이 참조할 product를 먼저 만들고 그 id를 사용한다.
async function seedProduct(): Promise<number> {
  await saveProduct(validProduct);
  const [product] = await findProducts();
  return product.id;
}

describe("cart.repository", () => {
  beforeEach(async () => {
    await resetProducts();
    await reset();
  });

  describe("saveNewItem", () => {
    it("장바구니 항목을 저장하면 id가 자동 부여된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 2 });
      const items = await findAll();
      expect(items[0].id).toBe(1);
    });

    it("장바구니 항목을 여러 개 저장하면 id가 순차적으로 부여된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      await saveNewItem({ productId, quantity: 2 });
      const items = await findAll();
      expect(items[0].id).toBe(1);
      expect(items[1].id).toBe(2);
    });
  });

  describe("findAll", () => {
    it("저장된 항목이 없으면 빈 배열을 반환한다.", async () => {
      expect(await findAll()).toEqual([]);
    });

    it("저장된 항목을 모두 반환한다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      expect(await findAll()).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("존재하는 장바구니 항목을 productId/quantity와 함께 반환한다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 3 });
      const [item] = await findAll();
      expect(await findById(item.id)).toMatchObject({ id: item.id, productId, quantity: 3 });
    });

    it("존재하지 않는 항목이면 undefined를 반환한다.", async () => {
      expect(await findById(9999)).toBeUndefined();
    });
  });

  describe("isAlreadyExist", () => {
    it("존재하는 항목이면 true를 반환한다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      expect(await isAlreadyExist(item.id)).toBe(true);
    });

    it("존재하지 않는 항목이면 false를 반환한다.", async () => {
      expect(await isAlreadyExist(9999)).toBe(false);
    });
  });

  describe("updateItemQuantity", () => {
    it("장바구니 항목의 수량을 새 값으로 교체한다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      await updateItemQuantity(item.id, 3);
      expect((await findAll())[0].quantity).toBe(3);
    });
  });

  describe("deleteById", () => {
    it("존재하는 항목을 삭제하면 true를 반환하고 항목이 제거된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      expect(await deleteById(item.id)).toBe(true);
      expect(await findAll()).toHaveLength(0);
    });

    it("존재하지 않는 항목을 삭제하면 다른 항목이 삭제되지 않는다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      await deleteById(9999);
      expect(await findAll()).toHaveLength(1);
    });
  });

  describe("deleteByProductId", () => {
    it("해당 productId를 가진 항목이 삭제된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      await deleteByProductId(productId);
      expect(await findAll()).toHaveLength(0);
    });

    it("존재하지 않는 productId면 다른 항목이 삭제되지 않는다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      await deleteByProductId(9999);
      expect(await findAll()).toHaveLength(1);
    });
  });
});
