import { useEffect, useRef, useState } from "react";
import type { AsyncState } from "../../../shared/useAsyncTask";
import type { CheckoutCouponResponse } from "../../../domain/checkout/checkout.api";

const useSelectedCheckoutCoupon = (
  getCheckoutCouponAsyncState: AsyncState<CheckoutCouponResponse>,
) => {
  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>([]);
  const isCheckoutCouponModalMounted = useRef(false);

  useEffect(() => {
    if (
      getCheckoutCouponAsyncState.data &&
      !isCheckoutCouponModalMounted.current
    ) {
      setSelectedCouponIds(
        getCheckoutCouponAsyncState.data.recommendedCouponIds,
      );

      isCheckoutCouponModalMounted.current = true;
    }
  }, [getCheckoutCouponAsyncState.data, isCheckoutCouponModalMounted]);

  const addSelectedCouponId = (couponId: number) => {
    setSelectedCouponIds((prev) => [...prev, couponId]);
  };

  const deleteSelectedCouponId = (couponId: number) => {
    setSelectedCouponIds((prev) => prev.filter((id) => id !== couponId));
  };

  return { selectedCouponIds, addSelectedCouponId, deleteSelectedCouponId };
};

export default useSelectedCheckoutCoupon;
