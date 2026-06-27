import type { CouponItem, OrderCoupon, OrderDetail } from "../types/order";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function createOrderApi(
  products: { id: number; quantity: number }[],
) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  });

  const json = await res.json();

  if (json.status !== "success") {
    throw new Error(json.code);
  }

  return json.data.orderId as number;
}

export async function patchOrderShippingApi(
  orderId: string,
  isRemoteArea: boolean,
): Promise<{ isRemoteArea: boolean; deliveryFee: number; orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number }> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/shipping`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isRemoteArea }),
  });

  const json = await res.json();

  if (json.status !== "success") {
    throw new Error("배송지 정보 변경에 실패했습니다.");
  }

  return json.data as { isRemoteArea: boolean; deliveryFee: number; orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number };
}

export async function getOrderApi(orderId: string): Promise<OrderDetail> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}`);
  const json = await res.json();

  if (json.status !== "success") {
    throw new Error("주문 정보를 불러오는 데 실패했습니다.");
  }

  return json.data as OrderDetail;
}

export async function postPaymentApi(
  orderId: number,
  amount: number,
): Promise<{ finalAmount: number }> {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, amount }),
  });

  const json = await res.json();

  if (json.status !== "success") {
    throw new Error(json.code);
  }

  return json.data as { finalAmount: number };
}

export async function patchOrderCouponApi(
  orderId: string,
  couponIds: number[],
): Promise<{ coupons: OrderCoupon[]; orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number }> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/coupons`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ couponIds }),
  });

  const json = await res.json();

  if (json.status !== "success") {
    throw new Error("쿠폰 적용에 실패했습니다.");
  }

  return json.data as { coupons: OrderCoupon[]; orderAmount: number; couponDiscount: number; shippingDiscount: number; totalAmount: number };
}

export async function getCouponsApi(orderId: string): Promise<CouponItem[]> {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/coupons`);
  const json = await res.json();

  if (json.status !== "success") {
    throw new Error("쿠폰 목록을 불러오는 데 실패했습니다.");
  }

  return json.data as CouponItem[];
}
