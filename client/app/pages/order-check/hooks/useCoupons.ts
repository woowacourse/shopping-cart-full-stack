import { useState } from "react";
import { getCoupons as getCouponsApi } from "../api";
import { Coupon } from "../types";

export default function useCoupons(orderId: string) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [maxCouponCount, setMaxCouponCount] = useState<number>(0);

  async function getCoupons() {
    const data = await getCouponsApi(orderId);
    setCoupons(data.items);
    setMaxCouponCount(data.max_coupon_count);
  }

  return { coupons, maxCouponCount, getCoupons };
}
