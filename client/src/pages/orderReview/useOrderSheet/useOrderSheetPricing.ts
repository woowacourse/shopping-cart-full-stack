import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useLoadData } from "@/services/core/useLoadData";

import { getOrderSheetPricing } from "@/services/apis/orderSheets/repository";

export const useOrderSheetPricing = () => {
  const { id } = useParams<{ id: string }>();

  const loadData = useLoadData({
    queryFn: useCallback(async () => {
      if (!id) return;

      return await getOrderSheetPricing({ id: Number(id) });
    }, [id]),
  });

  const { data } = loadData.status;
  const { refetch } = loadData;

  return {
    pricing: data,
    refetch,
  };
};
