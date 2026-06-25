import { CouponData } from "../type/types";
import useFetch from "./useFetch";
import { couponApi } from "../api/couponApi";

export default function useCouponData(orderId: number) {
  const { state, fetchData } = useFetch<CouponData[]>(() =>
    couponApi.get(orderId),
  );
  const couponData = state.status === "success" ? state.data : [];

  return { couponState: state, couponFetchData: fetchData, couponData };
}
