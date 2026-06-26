export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export const API_ENDPOINTS = {
  CART: "/cart",
  CART_ITEM: (id: number) => `/cart/${id}`,
  CHECKOUTS: "/checkouts",
  CHECKOUT: (checkoutId: number) => `/checkouts/${checkoutId}`,
  CHECKOUT_ADDRESS: (checkoutId: number) => `/checkouts/${checkoutId}/address`,
  CHECKOUT_COUPONS: (checkoutId: number) => `/checkouts/${checkoutId}/coupons`,
  CHECKOUT_DISCOUNT_PREVIEW: (checkoutId: number, couponIds: number[]) =>
    `/checkouts/${checkoutId}/coupons/discount-preview?${couponIds.map((id) => `couponIds=${id}`).join("&")}`,
  CHECKOUT_PAYMENT: (checkoutId: number) => `/checkouts/${checkoutId}/payment`,
  RESET: "/reset",
} as const;
