// frontend/src/ui/pages/PreorderPage/usePreorder.ts
import { useEffect, useState, useMemo, useCallback } from "react";
import { generateOrderReceipt } from "@cart/shared";
import { useCouponModal } from "./useCouponModal";
import { usePreorderQuery } from "./usePreorderQuery";
import { usePreorderMutation } from "./usePreorderMutation";

export const usePreorder = (preorderId: string | undefined) => {
  const { preorder, coupons, isLoading, initialCouponIds } =
    usePreorderQuery(preorderId);

  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>([]);
  const [isRemoteArea, setIsRemoteArea] = useState<boolean>(false);

  const modal = useCouponModal(selectedCouponIds);

  useEffect(() => {
    if (initialCouponIds.length > 0) {
      setSelectedCouponIds(initialCouponIds);
    }
  }, [initialCouponIds]);

  const calculateReceipt = useCallback(
    (targetCouponIds: number[]) => {
      if (!preorder) return null;
      const activeCoupons = coupons.filter((c) =>
        targetCouponIds.includes(c.couponId),
      );

      return generateOrderReceipt(
        preorder.items,
        activeCoupons,
        isRemoteArea,
        new Date(),
      );
    },
    [preorder, coupons, isRemoteArea],
  );

  const currentReceipt = useMemo(
    () => calculateReceipt(selectedCouponIds),
    [calculateReceipt, selectedCouponIds],
  );

  const tempReceipt = useMemo(
    () => calculateReceipt(modal.tempSelectedCouponIds),
    [calculateReceipt, modal.tempSelectedCouponIds],
  );

  const { submitPayment, isSubmitting } = usePreorderMutation();

  const handlePayment = () => {
    if (!preorder || !currentReceipt) return;
    submitPayment(
      preorder.preorderId,
      selectedCouponIds,
      isRemoteArea,
      currentReceipt.priceSummary,
    );
  };

  const applyCoupons = () => {
    setSelectedCouponIds(modal.tempSelectedCouponIds);
    modal.closeModal();
  };

  return {
    preorder,
    coupons,
    isRemoteArea,
    setIsRemoteArea,
    isLoading,
    isSubmitting,
    currentReceipt,
    tempReceipt,
    handlePayment,
    applyCoupons,
    ...modal,
  };
};
