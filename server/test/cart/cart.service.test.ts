import { jest } from "@jest/globals";
import CartService from "../../src/features/cart/cart.service.js";
import { CartNotFoundError } from "../../src/features/cart/cart.error.js";
import { type CartRepository } from "../../src/features/cart/cart.repository.js";

describe("CartService", () => {
  let cartRepository: any;
  let service: CartService;

  beforeEach(() => {
    cartRepository = {
      findAll: jest.fn(),
      findByProductId: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    service = new CartService(cartRepository as CartRepository);
  });

  describe("getAll", () => {
    it("장바구니의 모든 항목을 상품 정보와 함께 가져올 수 있다", async () => {
      cartRepository.findAll.mockResolvedValue([
        { product: { id: 1, name: "상품A", imgUrl: "/img1.jpg", price: 1000 }, quantity: 2 },
        { product: { id: 2, name: "상품B", imgUrl: "/img2.jpg", price: 2000 }, quantity: 3 },
      ]);

      const result = await service.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        product: { id: 1, name: "상품A", imgUrl: "/img1.jpg", price: 1000 },
        quantity: 2,
      });
    });
  });

  describe("updateQuantity", () => {
    it("장바구니 항목이 없으면 커스텀 에러를 던진다", async () => {
      cartRepository.findByProductId.mockResolvedValue(undefined);

      await expect(service.updateQuantity(1, 5)).rejects.toThrow(CartNotFoundError);
    });

    it("항목이 있으면 수량을 변경하고 저장한다", async () => {
      const existingItem = { product_id: 1, quantity: 2 };
      cartRepository.findByProductId.mockResolvedValue(existingItem);
      cartRepository.save.mockResolvedValue({ ...existingItem, quantity: 5 });

      const result = await service.updateQuantity(1, 5);

      expect(result).toEqual({ productId: 1, quantity: 5 });
      expect(cartRepository.save).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("장바구니 항목 삭제를 장바구니 레포가 실행", async () => {
      cartRepository.remove.mockResolvedValue(undefined);

      await service.delete(1);
      expect(cartRepository.remove).toHaveBeenCalledWith(1);
    });
  });
});
