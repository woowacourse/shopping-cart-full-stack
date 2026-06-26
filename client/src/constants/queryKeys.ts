import { API_ENDPOINTS } from "./apis";

export const CART_QUERY_KEY = API_ENDPOINTS.CART;

export const checkoutQueryKey = (checkoutId: number) => API_ENDPOINTS.CHECKOUT(checkoutId);

export const discountPreviewQueryKey = (checkoutId: number, couponIds: number[]) =>
  API_ENDPOINTS.CHECKOUT_DISCOUNT_PREVIEW(checkoutId, couponIds);
