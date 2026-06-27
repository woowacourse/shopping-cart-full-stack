jest.mock("../orders/orders.repository");

import { AppError } from "@/errors/AppError";
import * as repo from "../orders/orders.repository";
import { createPayment } from "./payments.service";

const mockGetOrderById = repo.getOrderByIdQuery as jest.MockedFunction<
  typeof repo.getOrderByIdQuery
>;
const mockGetOrderProducts = repo.getOrderProductsByOrderIdQuery as jest.MockedFunction<
  typeof repo.getOrderProductsByOrderIdQuery
>;
const mockGetOrderCoupons = repo.getOrderCouponsByOrderIdQuery as jest.MockedFunction<
  typeof repo.getOrderCouponsByOrderIdQuery
>;
const mockRemoveExpiredCoupons = repo.removeExpiredCouponsFromOrderQuery as jest.MockedFunction<
  typeof repo.removeExpiredCouponsFromOrderQuery
>;

const mockOrder = { id: 1, isExpired: false, isRemoteArea: false, deliveryFee: 3000 };
const mockProducts = [
  { id: 1, name: "아메리카노", price: 50_000, image: "", quantity: 1 },
];
const validCoupon = {
  id: 1,
  code: "",
  title: "5000원 할인",
  discountType: "fixed" as const,
  discountValue: 5_000,
  minimumAmount: 50_000,
  expirationDate: "2099-12-31",
};
const expiredCoupon = { ...validCoupon, id: 2, expirationDate: "2020-01-01" };

describe("createPayment", () => {
  beforeEach(() => jest.clearAllMocks());

  it("존재하지 않는 주문이면 NOT_FOUND_ORDER 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(null);

    await expect(createPayment({ orderId: 999, amount: 0 })).rejects.toMatchObject({
      code: "NOT_FOUND_ORDER",
    });
  });

  it("만료된 쿠폰이 있으면 order_coupons에서 제거 후 EXPIRED_COUPON 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockGetOrderCoupons.mockResolvedValue([expiredCoupon]);
    mockRemoveExpiredCoupons.mockResolvedValue(undefined);

    await expect(createPayment({ orderId: 1, amount: 0 })).rejects.toMatchObject({
      code: "EXPIRED_COUPON",
    });
    expect(mockRemoveExpiredCoupons).toHaveBeenCalledWith(1, [2]);
  });

  it("결제 금액이 불일치하면 PAYMENT_AMOUNT_MISMATCH 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockGetOrderCoupons.mockResolvedValue([]);
    // finalAmount = 50,000 + 3,000 = 53,000 이지만 48,000 보냄
    await expect(createPayment({ orderId: 1, amount: 48_000 })).rejects.toMatchObject({
      code: "PAYMENT_AMOUNT_MISMATCH",
    });
  });

  it("금액이 일치하면 finalAmount를 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockGetOrderCoupons.mockResolvedValue([]);
    // finalAmount = 50,000 + 3,000 = 53,000
    const result = await createPayment({ orderId: 1, amount: 53_000 });
    expect(result).toEqual({ finalAmount: 53_000 });
  });
});
