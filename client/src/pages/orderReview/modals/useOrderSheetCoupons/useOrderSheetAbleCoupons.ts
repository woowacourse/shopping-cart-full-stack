import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useLoadData } from "@/services/core/useLoadData";

import { getOrderSheetAbleCoupons } from "@/services/apis/orderSheets/repository";

export const useOrderSheetAbleCoupons = () => {
  const { id } = useParams<{ id: string }>();

  const ableCouponsLoadData = useLoadData({
    queryFn: useCallback(async () => {
      return await getOrderSheetAbleCoupons({ id: Number(id) });
    }, [id]),
  });

  const ableCoupons = ableCouponsLoadData.status.data?.ableCoupons;

  return {
    ableCoupons,
  };
};
