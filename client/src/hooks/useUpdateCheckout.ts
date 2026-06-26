import { useState } from "react";
import { updateCheckoutAddress, updateCheckoutCoupons } from "../apis/checkout/checkout";
import { checkoutQueryKey } from "../constants/queryKeys";
import { useMyMutation } from "../lib/myQuery/useMyMutation";

export function useUpdateCheckout(checkoutId: number) {
  const queryKey = checkoutQueryKey(checkoutId);

  const [pending, setPending] = useState(false);

  const { mutate: mutateAddress } = useMyMutation(queryKey, (isRemoteArea: boolean) =>
    updateCheckoutAddress(checkoutId, isRemoteArea),
  );
  const { mutate: mutateCoupons } = useMyMutation(queryKey, (selectedCouponIds: number[]) =>
    updateCheckoutCoupons(checkoutId, selectedCouponIds),
  );

  const updateRemoteArea = async (isRemoteArea: boolean) => {
    if (pending) return;

    setPending(true);
    try {
      await mutateAddress(isRemoteArea);
    } finally {
      setPending(false);
    }
  };

  const updateAppliedCoupon = async (selectedCouponIds: number[]) => {
    if (pending) return;

    setPending(true);
    try {
      await mutateCoupons(selectedCouponIds);
    } finally {
      setPending(false);
    }
  };

  return { updateRemoteArea, updateAppliedCoupon, pending };
}
