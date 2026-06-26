import { cartFetcher } from './cartFetcher';
import type { Coupon, OrderCheckPayInfo, OrderCheckProduct } from './apiTypes';

export const orderCheckApiService = {
    createOrderCheck: () =>
        cartFetcher<{ status: number; data: { products: OrderCheckProduct[] } }>('/order-check', {
            method: 'POST',
        }),

    getOrderCheck: () =>
        cartFetcher<{ status: number; data: { products: OrderCheckProduct[]; payInfo: OrderCheckPayInfo } }>(
            '/order-check'
        ),

    getOrderCheckPayInfo: () => cartFetcher<{ status: number; data: OrderCheckPayInfo }>('/order-check/pay-info'),

    selectRemoteArea: (checkStatus: boolean) =>
        cartFetcher<{ status: number; data: { checkStatus: boolean } }>('/order-check/select/remote-areas', {
            method: 'PATCH',
            body: JSON.stringify({ checkStatus }),
        }),

    getCoupons: () =>
        cartFetcher<{ status: number; data: { coupons: Coupon[]; selectedCoupons: string[] } }>('/order-check/coupons'),

    selectCoupons: (selectedCouponId: string[]) =>
        cartFetcher<null>('/order-check/coupons', {
            method: 'PATCH',
            body: JSON.stringify({ selectedCouponId }),
        }),

    calculateCouponDiscount: (selectedCouponId: string[]) =>
        cartFetcher<{ status: number; data: { discountAmount: number } }>('/order-check/coupons', {
            method: 'POST',
            body: JSON.stringify({ selectedCouponId }),
        }),
};
