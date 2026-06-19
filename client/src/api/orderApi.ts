export const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const orderApi = {
  // GET/order/:orderId
  get: (orderId: number) => fetch(`${BASE_URL}/order/${orderId}`),

  // POST/order/:orderId/payment
  post: (orderId: number, body: {}) =>
    fetch(`${BASE_URL}/order/${orderId}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  // payment 요청에서 orderId 삭제
  delete: (orderId: number) =>
    fetch(`${BASE_URL}/order/${orderId}`, { method: "DELETE" }),

  //쿠폰 적용 PATCH/ order/:orderId/coupon
  patch: (orderId: number, couponId: number) =>
    fetch(`${BASE_URL}/order/${orderId}/coupon`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderId),
    }),
};
