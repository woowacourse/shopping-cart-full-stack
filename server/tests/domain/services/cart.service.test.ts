import { updateCartItemQuantity, deleteCartItem, getCartItems } from "../../../src/services/cart.service.js";
import { reset as resetCart, saveNewItem, findAll } from "../../../src/repositories/cart.repository.js";
import {
  reset as resetProducts,
  save as saveProduct,
  findAll as findProducts,
} from "../../../src/repositories/products.repository.js";
import { AppError } from "../../../src/errors/AppError.js";

const validProduct = {
  name: "콜라",
  stock: 10,
  imageUrl: "https://example.com/images/cola.png",
  price: 1500,
};

async function seedProduct(overrides: Partial<typeof validProduct> = {}): Promise<number> {
  await saveProduct({ ...validProduct, ...overrides });
  const [product] = await findProducts();
  return product.id;
}

describe("cart.service", () => {
  beforeEach(async () => {
    await resetProducts();
    await resetCart();
  });

  describe("getCartItems", () => {
    it("장바구니 목록을 상품 정보와 함께 반환한다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 2 });

      const items = await getCartItems();

      expect(items).toEqual([
        {
          id: expect.any(Number),
          name: validProduct.name,
          price: validProduct.price,
          quantity: 2,
          stock: validProduct.stock,
          status: "available",
          image_url: validProduct.imageUrl,
        },
      ]);
    });

    it.each([
      ["재고가 0이면", 0, 1, "outOfStock"],
      ["장바구니 수량이 재고보다 많으면", 3, 5, "quantityExceeded"],
      ["장바구니 수량이 재고 이하면", 5, 3, "available"],
    ])("%s status가 %s로 계산된다.", async (_caseName, stock, quantity, expectedStatus) => {
      const productId = await seedProduct({ stock });
      await saveNewItem({ productId, quantity });

      const [item] = await getCartItems();

      expect(item.status).toBe(expectedStatus);
    });
  });

  describe("updateCartItemQuantity", () => {
    it("유효한 요청이면 정상 완료된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      await expect(updateCartItemQuantity(item.id, 5)).resolves.not.toThrow();
    });

    it("존재하지 않는 장바구니 항목이면 CART_ITEM_NOT_FOUND AppError를 던진다.", async () => {
      await expect(updateCartItemQuantity(9999, 1)).rejects.toThrow(AppError);
      await expect(updateCartItemQuantity(9999, 1)).rejects.toMatchObject({ code: "CART_ITEM_NOT_FOUND" });
    });

    it("요청 수량이 재고보다 많고 기존 수량보다도 많으면 OUT_OF_STOCK AppError를 던진다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      await expect(updateCartItemQuantity(item.id, validProduct.stock + 1)).rejects.toMatchObject({
        code: "OUT_OF_STOCK",
      });
    });

    it("요청 수량이 재고보다 많아도 기존 수량보다 작으면(줄이는 요청) 정상 완료된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: validProduct.stock + 2 });
      const [item] = await findAll();
      await expect(updateCartItemQuantity(item.id, validProduct.stock + 1)).resolves.not.toThrow();
    });
  });

  describe("deleteCartItem", () => {
    it("존재하는 항목을 삭제하면 정상 완료된다.", async () => {
      const productId = await seedProduct();
      await saveNewItem({ productId, quantity: 1 });
      const [item] = await findAll();
      await expect(deleteCartItem(item.id)).resolves.not.toThrow();
    });

    it("존재하지 않는 항목을 삭제하면 CART_ITEM_NOT_FOUND AppError를 던진다.", async () => {
      await expect(deleteCartItem(9999)).rejects.toMatchObject({ code: "CART_ITEM_NOT_FOUND" });
    });
  });
});
