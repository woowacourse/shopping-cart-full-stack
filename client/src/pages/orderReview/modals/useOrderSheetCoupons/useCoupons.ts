import { useLoadData } from "@/services/core/useLoadData";

import { getCoupons } from "@/services/apis/coupons/repository";

export const useCoupons = () => {
  const couponsLoadData = useLoadData({
    queryFn: getCoupons,
  });

  const coupons = couponsLoadData.status.data?.coupons;

  return {
    coupons,
  };
};
