import { handleResponse } from "../http";
import type {
  CreateCheckoutRequest,
  CreateCheckoutResponse,
  GetCheckoutResponse,
  UpdateAddressRequest,
  UpdateCouponsRequest,
  DiscountPreviewResponse,
  PaymentRequest,
  PaymentResponse,
} from "./checkoutSchema";
import { BASE_URL, API_ENDPOINTS } from "../../constants/apis";
import { toCheckout } from "./checkoutMapper";
import type { Checkout, PaymentSummary } from "../../domain/checkout";

export async function createCheckout(items: CreateCheckoutRequest["items"]): Promise<number> {
  const body: CreateCheckoutRequest = { items };
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUTS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: CreateCheckoutResponse = await handleResponse(response);
  return data.checkout_id;
}

export async function getCheckout(checkoutId: Checkout["checkoutId"]): Promise<Checkout> {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT(checkoutId)}`);
  const data: GetCheckoutResponse = await handleResponse(response);
  return toCheckout(data);
}

export async function deleteCheckout(checkoutId: Checkout["checkoutId"]): Promise<void> {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT(checkoutId)}`, { method: "DELETE" });
  await handleResponse<void>(response);
}

export async function updateCheckoutAddress(checkoutId: Checkout["checkoutId"], remoteArea: boolean): Promise<void> {
  const body: UpdateAddressRequest = { remote_area: remoteArea };
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT_ADDRESS(checkoutId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await handleResponse<void>(response);
}

export async function updateCheckoutCoupons(checkoutId: Checkout["checkoutId"], couponIds: number[]): Promise<void> {
  const body: UpdateCouponsRequest = { coupons: couponIds.length > 0 ? couponIds : null };
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT_COUPONS(checkoutId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  await handleResponse<void>(response);
}

export async function getCouponDiscount(checkoutId: Checkout["checkoutId"], couponIds: number[]): Promise<number> {
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT_DISCOUNT_PREVIEW(checkoutId, couponIds)}`);
  const data: DiscountPreviewResponse = await handleResponse(response);
  return data.coupon_discount;
}

export async function submitPayment(
  checkoutId: Checkout["checkoutId"],
  remoteArea: boolean,
  couponIds: number[],
): Promise<PaymentSummary> {
  const body: PaymentRequest = { remote_area: remoteArea, coupons: couponIds.length > 0 ? couponIds : null };
  const response = await fetch(`${BASE_URL}${API_ENDPOINTS.CHECKOUT_PAYMENT(checkoutId)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: PaymentResponse = await handleResponse(response);
  return {
    itemCount: data.item_count,
    totalQuantity: data.total_quantity,
    totalAmount: data.total_amount,
  };
}
