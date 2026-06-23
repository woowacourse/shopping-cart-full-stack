export const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const orderApi = {
  //POST/order
  create: (body: { items: Array<{ productId: number; quantity: number }> }) =>
    fetch(`${BASE_URL}/order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // GET/order/:orderId
  get: (orderId: number) => fetch(`${BASE_URL}/order/${orderId}`),

  // PATCH/order/:orderId/address
  patchAddress: (orderId: number, remoteArea: boolean) =>
    fetch(`${BASE_URL}/order/${orderId}/address`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remoteArea }),
    }),

  // POST/order/:orderId/payment
  pay: (orderId: number, body: {}) =>
    fetch(`${BASE_URL}/order/${orderId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // payment 요청에서 orderId 삭제
  delete: (orderId: number) =>
    fetch(`${BASE_URL}/order/${orderId}`, { method: "DELETE" }),

  //쿠폰 적용 PATCH/ order/:orderId/coupon
  applyCoupon: (orderId: number, couponIds: number[]) =>
    fetch(`${BASE_URL}/order/${orderId}/coupon`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponIds }),
    }),
};
