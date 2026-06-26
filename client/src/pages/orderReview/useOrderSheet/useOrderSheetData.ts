import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useLoadData } from "@/services/core/useLoadData";

import { getOrderSheet } from "@/services/apis/orderSheets/repository";

export const useOrderSheetData = () => {
  const { id } = useParams<{ id: string }>();

  const orderSheetLoadData = useLoadData({
    queryFn: useCallback(async () => {
      if (!id) return;

      return await getOrderSheet({ id: Number(id) });
    }, [id]),
  });

  const { status, data } = orderSheetLoadData.status;
  const { refetch } = orderSheetLoadData;

  const totalCount = data?.products.reduce((acc, product) => {
    acc += product.quantity;
    return acc;
  }, 0);

  return {
    status,

    products: data?.products,
    totalCount,

    isRemoteArea: data?.isRemoteArea,

    couponSelection: data?.selectedCoupons,

    refetch,
  };
};
