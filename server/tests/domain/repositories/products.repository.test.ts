import {
  save,
  findAll,
  findById,
  deleteById,
  isAlreadyExist,
  reset,
} from "../../../src/repositories/products.repository.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

describe("products.repository", () => {
  beforeEach(async () => {
    await reset();
  });

  describe("save", () => {
    it("상품을 저장하면 id가 자동 부여된다.", async () => {
      await save(validProduct);
      const products = await findAll();
      expect(products[0].id).toBe(1);
    });

    it("상품을 여러 개 저장하면 id가 순차적으로 부여된다.", async () => {
      await save(validProduct);
      await save(validProduct);
      const products = await findAll();
      expect(products[0].id).toBe(1);
      expect(products[1].id).toBe(2);
    });
  });

  describe("findAll", () => {
    it("저장된 상품이 없으면 빈 배열을 반환한다.", async () => {
      expect(await findAll()).toEqual([]);
    });

    it("저장된 상품을 모두 반환한다.", async () => {
      await save(validProduct);
      expect(await findAll()).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("존재하는 상품을 반환한다.", async () => {
      await save(validProduct);
      const [product] = await findAll();
      expect(await findById(product.id)).toMatchObject({ name: validProduct.name });
    });

    it("존재하지 않는 상품이면 undefined를 반환한다.", async () => {
      expect(await findById(9999)).toBeUndefined();
    });
  });

  describe("isAlreadyExist", () => {
    it("존재하는 상품이면 true를 반환한다.", async () => {
      await save(validProduct);
      const [product] = await findAll();
      expect(await isAlreadyExist(product.id)).toBe(true);
    });

    it("존재하지 않는 상품이면 false를 반환한다.", async () => {
      expect(await isAlreadyExist(9999)).toBe(false);
    });
  });

  describe("deleteById", () => {
    it("존재하는 상품을 삭제하면 true를 반환하고 상품이 제거된다.", async () => {
      await save(validProduct);
      const [product] = await findAll();
      expect(await deleteById(product.id)).toBe(true);
      expect(await findAll()).toHaveLength(0);
    });

    it("존재하지 않는 상품을 삭제하면 false를 반환하고 다른 상품이 삭제되지 않는다.", async () => {
      await save(validProduct);
      expect(await deleteById(9999)).toBe(false);
      expect(await findAll()).toHaveLength(1);
    });
  });
});
