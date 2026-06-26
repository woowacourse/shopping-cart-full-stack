import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";

import { useLoadData } from "@/services/core/useLoadData";

import { postOrderSheetCouponsDiscountPreview } from "@/services/apis/orderSheets/repository";

interface Props {
  couponSelection: number[];
  updateCouponSelection: ({
    couponSelection,
  }: {
    couponSelection: number[];
  }) => void;
}

export const useOrderSheetCouponSelection = ({
  couponSelection,
  updateCouponSelection: updateCouponSelectionActions,
}: Props) => {
  const { id } = useParams<{ id: string }>();

  const [draftCouponSelection, setDraftCouponSelection] =
    useState(couponSelection);
  const changeCouponSelection = ({
    id,
    checked,
  }: {
    id: number;
    checked: boolean;
  }) => {
    const newDraftCouponSelection: number[] = checked
      ? [...draftCouponSelection, id]
      : draftCouponSelection.filter((couponId) => couponId !== id);
    setDraftCouponSelection(newDraftCouponSelection);
  };

  const discountPreviewData = useLoadData({
    queryFn: useCallback(async () => {
      return await postOrderSheetCouponsDiscountPreview({
        id: Number(id),
        selectedCoupons: draftCouponSelection,
      });
    }, [id, draftCouponSelection]),
  });

  const discountAmount = discountPreviewData.status.data?.discountAmount;

  const updateCouponSelection = async () => {
    await updateCouponSelectionActions({
      couponSelection: draftCouponSelection,
    });
  };

  return {
    draftCouponSelection,
    discountAmount,
    changeCouponSelection,
    updateCouponSelection,
  };
};
