import type { Coupon } from "@cart/shared";
import type { CouponApiInterface } from "../interfaces/CouponApiInterface";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchCouponApi: CouponApiInterface = {
  getCoupons: async (): Promise<Coupon[]> => {
    const response = await fetch(`${BASE_URL}/coupons`);
    if (!response.ok) throw new Error("쿠폰 정보를 불러올 수 없습니다.");
    return response.json();
  },
};
