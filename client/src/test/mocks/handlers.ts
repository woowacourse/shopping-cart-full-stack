import { http, HttpResponse } from "msw";

export const BASE_URL = "http://localhost:3000";

export interface MockCartItem {
  product: {
    id: string;
    image: string;
    name: string;
    price: number;
  };
  quantity: number;
}

export const mockCarts: MockCartItem[] = [
  {
    product: { id: "1", image: "/a.png", name: "테스트 상품 A", price: 10000 },
    quantity: 1,
  },
  {
    product: { id: "2", image: "/b.png", name: "테스트 상품 B", price: 20000 },
    quantity: 2,
  },
];

export const mockCoupons = [
  { id: 1, name: "5,000원 할인 쿠폰", type: "FIXED5000", expiryDate: "2026-11-30", minAmount: 100000, startTime: null, endTime: null },
  { id: 2, name: "2+1 쿠폰", type: "BOGO", expiryDate: "2026-06-30", minAmount: null, startTime: null, endTime: null },
];

export const handlers = [
  http.get(`${BASE_URL}/carts`, () => HttpResponse.json(mockCarts)),
  http.patch(`${BASE_URL}/carts/:id`, () => new HttpResponse(null, { status: 200 })),
  http.delete(`${BASE_URL}/carts/:id`, () => new HttpResponse(null, { status: 200 })),

  http.get(`${BASE_URL}/coupons`, () => HttpResponse.json({ coupons: mockCoupons })),

  // 선택한 쿠폰에 따라 간단히 응답을 만든다. (서버 계산 로직은 백엔드에서 검증)
  http.post(`${BASE_URL}/coupons/calculation`, async ({ request }) => {
    const { items, couponIds, isRemoteArea } = (await request.json()) as {
      items: { price: number; quantity: number }[];
      couponIds: number[];
      isRemoteArea: boolean;
    };
    const orderAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = couponIds.includes(1) ? 5000 : 0;
    const baseFee = orderAmount >= 100000 ? 0 : 3000;
    const shippingFee = baseFee + (isRemoteArea ? 3000 : 0);

    return HttpResponse.json({
      orderAmount,
      discountAmount,
      shippingFee,
      totalPayment: orderAmount - discountAmount + shippingFee,
      totalDiscount: discountAmount,
      availableCouponIds: [1, 2],
      recommendedCouponIds: [1],
    });
  }),

  http.post(`${BASE_URL}/coupons/validation`, () =>
    HttpResponse.json({ message: "올바른 쿠폰입니다." }),
  ),
];
