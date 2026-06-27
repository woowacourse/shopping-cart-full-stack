jest.mock("./orders.repository");

import { AppError } from "@/errors/AppError";
import * as repo from "./orders.repository";
import { getCoupons, getOrder, patchOrderCoupon, patchOrderShipping } from "./orders.service";

const mockGetOrderById = repo.getOrderByIdQuery as jest.MockedFunction<
  typeof repo.getOrderByIdQuery
>;
const mockGetOrderProducts =
  repo.getOrderProductsByOrderIdQuery as jest.MockedFunction<
    typeof repo.getOrderProductsByOrderIdQuery
  >;
const mockGetOrderCoupons =
  repo.getOrderCouponsByOrderIdQuery as jest.MockedFunction<
    typeof repo.getOrderCouponsByOrderIdQuery
  >;
const mockGetAllCoupons = repo.getAllCouponsQuery as jest.MockedFunction<
  typeof repo.getAllCouponsQuery
>;
const mockUpdateOrderCoupons = repo.updateOrderCouponsQuery as jest.MockedFunction<
  typeof repo.updateOrderCouponsQuery
>;
const mockUpdateOrderIsRemoteArea = repo.updateOrderIsRemoteAreaQuery as jest.MockedFunction<
  typeof repo.updateOrderIsRemoteAreaQuery
>;
const mockUpdateOrderProductGifts = repo.updateOrderProductGiftsQuery as jest.MockedFunction<
  typeof repo.updateOrderProductGiftsQuery
>;

const mockOrder = { id: 1, isExpired: false, isRemoteArea: false, deliveryFee: 3000 };
const mockProducts = [
  { id: 1, name: "아메리카노", price: 4500, image: "https://img.com/1.jpg", quantity: 2 },
];
const mockCoupons = [
  {
    id: 1,
    code: "FIXED5000",
    title: "5000원 할인",
    discountType: "fixed" as const,
    discountValue: 5000,
    minimumAmount: 50000,
    expirationDate: "2025-12-31",
  },
];

const allCoupons = [
  {
    id: 1,
    code: "FIXED5000",
    title: "5000원 할인",
    discountType: "fixed" as const,
    discountValue: 5000,
    minimumAmount: 50000,
    expirationDate: "2099-12-31",
  },
  {
    id: 2,
    code: "EXPIRED",
    title: "만료 쿠폰",
    discountType: "fixed" as const,
    discountValue: 1000,
    expirationDate: "2020-01-01",
  },
];

describe("getCoupons", () => {
  beforeEach(() => jest.clearAllMocks());

  it("존재하지 않는 주문이면 NOT_FOUND_ORDER 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(null);

    await expect(getCoupons(999)).rejects.toMatchObject({ code: "NOT_FOUND_ORDER" });
  });

  it("각 쿠폰에 isCouponUsable 필드가 포함된다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetAllCoupons.mockResolvedValue(allCoupons);
    mockGetOrderProducts.mockResolvedValue(mockProducts); // 4500 * 2 = 9000

    const result = await getCoupons(1);

    expect(result[0]).toHaveProperty("isCouponUsable");
  });

  it("최소 주문 금액 미달 쿠폰은 isCouponUsable이 false이다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetAllCoupons.mockResolvedValue(allCoupons);
    mockGetOrderProducts.mockResolvedValue(mockProducts); // 합계 9000 < 최소 50000

    const result = await getCoupons(1);
    const fixed = result.find((c) => c.code === "FIXED5000");

    expect(fixed?.isCouponUsable).toBe(false);
  });

  it("만료된 쿠폰은 isCouponUsable이 false이다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetAllCoupons.mockResolvedValue(allCoupons);
    mockGetOrderProducts.mockResolvedValue(mockProducts);

    const result = await getCoupons(1);
    const expired = result.find((c) => c.code === "EXPIRED");

    expect(expired?.isCouponUsable).toBe(false);
  });
});

const couponFixture = {
  id: 1,
  code: "",
  title: "5000원 할인",
  discountType: "fixed" as const,
  discountValue: 5000,
  minimumAmount: 50000,
  expirationDate: "2099-12-31",
};

const expiredCouponFixture = {
  ...couponFixture,
  id: 2,
  expirationDate: "2020-01-01",
};

describe("patchOrderCoupon", () => {
  beforeEach(() => jest.clearAllMocks());

  it("존재하지 않는 주문이면 NOT_FOUND_ORDER 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(null);

    await expect(patchOrderCoupon(999, { couponIds: [1] })).rejects.toMatchObject({
      code: "NOT_FOUND_ORDER",
    });
  });

  it("만료된 쿠폰이면 EXPIRED_COUPON 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetAllCoupons.mockResolvedValue([expiredCouponFixture]);
    mockGetOrderProducts.mockResolvedValue(mockProducts);

    await expect(patchOrderCoupon(1, { couponIds: [2] })).rejects.toMatchObject({
      code: "EXPIRED_COUPON",
    });
  });

  it("쿠폰 변경 성공 시 적용된 쿠폰 목록과 금액을 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetAllCoupons.mockResolvedValue([couponFixture]);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockUpdateOrderCoupons.mockResolvedValue(undefined);
    mockUpdateOrderProductGifts.mockResolvedValue(undefined);

    const result = await patchOrderCoupon(1, { couponIds: [1] });

    expect(result).toMatchObject({
      coupons: [{ id: 1, title: "5000원 할인", discountType: "fixed", discountValue: 5000 }],
      orderAmount: 9000,
      couponDiscount: 0,
      shippingDiscount: 0,
      totalAmount: 12000,
    });
  });
});

describe("patchOrderShipping", () => {
  beforeEach(() => jest.clearAllMocks());

  it("isRemoteArea 업데이트 후 deliveryFee와 금액을 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockUpdateOrderIsRemoteArea.mockResolvedValue(undefined);
    mockGetOrderCoupons.mockResolvedValue([]);
    mockGetOrderProducts.mockResolvedValue(mockProducts);

    const result = await patchOrderShipping(1, { isRemoteArea: true });

    expect(result).toMatchObject({ isRemoteArea: true, deliveryFee: 6000, orderAmount: 9000, totalAmount: 15000 });
  });

  it("isRemoteArea false이면 기본 배송비를 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockUpdateOrderIsRemoteArea.mockResolvedValue(undefined);
    mockGetOrderCoupons.mockResolvedValue([]);
    mockGetOrderProducts.mockResolvedValue(mockProducts);

    const result = await patchOrderShipping(1, { isRemoteArea: false });

    expect(result).toMatchObject({ isRemoteArea: false, deliveryFee: 3000, orderAmount: 9000, totalAmount: 12000 });
  });
});

describe("getOrder", () => {
  beforeEach(() => jest.clearAllMocks());

  it("존재하지 않는 주문이면 NOT_FOUND_ORDER 에러를 던진다", async () => {
    mockGetOrderById.mockResolvedValue(null);

    await expect(getOrder(999)).rejects.toThrow(AppError);
    await expect(getOrder(999)).rejects.toMatchObject({
      code: "NOT_FOUND_ORDER",
    });
  });

  it("주문 정보(products, coupons, isRemoteArea, deliveryFee)와 금액을 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockGetOrderCoupons.mockResolvedValue(mockCoupons);

    const result = await getOrder(1);

    expect(result).toMatchObject({
      products: mockProducts,
      coupons: [{ id: 1, title: "5000원 할인", discountType: "fixed", discountValue: 5000 }],
      isRemoteArea: false,
      deliveryFee: 3000,
      orderAmount: 9000,
      couponDiscount: 0,
      shippingDiscount: 0,
      totalAmount: 12000,
    });
  });

  it("쿠폰이 없어도 빈 배열로 반환한다", async () => {
    mockGetOrderById.mockResolvedValue(mockOrder);
    mockGetOrderProducts.mockResolvedValue(mockProducts);
    mockGetOrderCoupons.mockResolvedValue([]);

    const result = await getOrder(1);

    expect(result.coupons).toEqual([]);
  });
});
