import { useEffect, useState } from "react";
import { CouponData, OrderData } from "../type/types";
import useFetch from "./useFetch";
import { couponApi } from "../api/couponApi";

export default function useCouponData(orderId: number) {
  const { state, fetchData } = useFetch<CouponData[]>(() =>
    couponApi.get(orderId),
  );
  const [couponData, setCouponData] = useState<CouponData[]>([]);

  useEffect(() => {
    if (state.status !== "success") return;
    setCouponData(state.data);
  }, [state]);

  return { couponState: state, fetchData, couponData };
}
