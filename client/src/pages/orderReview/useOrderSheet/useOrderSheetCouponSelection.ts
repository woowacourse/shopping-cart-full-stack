import { useCallback } from "react";
import { useParams } from "react-router-dom";

import { useExecute } from "@/services/core/useExecute";

import { patchOrderSheetCoupons } from "@/services/apis/orderSheets/repository";

interface Props {
  onUpdate: () => void;
}

export const useOrderSheetCouponSelection = ({ onUpdate }: Props) => {
  const { id } = useParams<{ id: string }>();

  const { mutate: updateSelectedCouponsMutate } = useExecute({
    executeFn: useCallback(
      async (selectedCoupons: number[]) => {
        return await patchOrderSheetCoupons({
          id: Number(id),
          selectedCoupons,
        });
      },
      [id],
    ),
    onSuccess: () => {
      onUpdate();
    },
  });

  return {
    updateSelectedCouponsMutate,
  };
};
