export const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const couponApi = {
  // GET/coupons/:orderId
  get: (orderId: number) => fetch(`${BASE_URL}/coupons/${orderId}`),
};
