import type { Coupon } from "@/types/coupon";
import fetcher from "@apis/instance";

const COUPONS_API = "/coupons";

interface GetCouponsResponse {
  status: "success" | "error";
  message: string;
  data: {
    couponList: Coupon[];
  };
}

export const getCoupons = async () => {
  const { data } = await fetcher.get<GetCouponsResponse>(`${COUPONS_API}`);
  return data.couponList;
};
