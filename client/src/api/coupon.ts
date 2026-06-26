import type { Coupon } from '../types/coupon.types';
import { http, type APIResponse } from './api';

type GetOrderCouponsResponse = {
  maxSelectableCouponCount: number;
  coupons: Coupon[];
};
export const getOrderCoupons = (
  orderId: number,
): Promise<APIResponse<GetOrderCouponsResponse>> =>
  http.get<APIResponse<GetOrderCouponsResponse>>(`/orders/${orderId}/coupons`);

type CouponsBody = { coupons: number[] };

export const getCouponsDiscount = (
  orderId: number,
  couponIds: number[],
): Promise<APIResponse<{ discountAmount: number }>> =>
  http.post<APIResponse<{ discountAmount: number }>, CouponsBody>(
    `/orders/${orderId}/coupons/discount`,
    { coupons: couponIds },
  );

export const updateOrderCoupons = (
  orderId: number,
  couponIds: number[],
): Promise<APIResponse<{ id: number; coupons: number[] }>> =>
  http.patch<APIResponse<{ id: number; coupons: number[] }>, CouponsBody>(
    `/orders/${orderId}/coupons`,
    { coupons: couponIds },
  );
