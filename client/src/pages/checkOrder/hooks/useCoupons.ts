import { useState, useEffect } from "react";
import { BASE_URL } from "../constants/constant";
import type { Coupon } from "../types";

/** 사용 가능한 쿠폰 목록을 불러온다. */
export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/coupons`)
      .then(async (response) => {
        if (!response.ok) throw new Error("쿠폰을 불러오지 못했습니다.");
        const data: { coupons: Coupon[] } = await response.json();
        setCoupons(data.coupons);
      })
      .catch((error) => {
        console.error(error);
        setError("쿠폰 목록을 불러오지 못했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { coupons, isLoading, error };
}
