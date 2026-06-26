import { useEffect } from "react";
import useAsyncTask, {
  type ExecuteAsyncFunctionProps,
} from "../../../shared/useAsyncTask";
import {
  getCheckoutCoupons,
  updateCheckoutApplyCoupon,
  type CheckoutApplyCouponResponse,
  type CheckoutCouponResponse,
} from "../../../domain/checkout/checkout.api";

const useCheckoutCoupon = (checkoutId: number) => {
  const {
    asyncState: getCheckoutCouponAsyncState,
    executeAsyncFunction: executeGetCheckoutCoupon,
  } = useAsyncTask<CheckoutCouponResponse>();

  const {
    asyncState: updateApplyCouponAsyncState,
    executeAsyncFunction: executeUpdateApplyCoupon,
  } = useAsyncTask<CheckoutApplyCouponResponse>();

  useEffect(() => {
    executeGetCheckoutCoupon({
      asyncFunction: () => getCheckoutCoupons(checkoutId),
      options: {
        onFail: (error) => alert(error.message),
      },
    });
  }, [executeGetCheckoutCoupon]);

  const requestUpdateCheckoutApplyCoupon = async (
    nextCouponIds: number[],
    options: ExecuteAsyncFunctionProps<CheckoutApplyCouponResponse>["options"],
  ) => {
    await executeUpdateApplyCoupon({
      asyncFunction: () => updateCheckoutApplyCoupon(checkoutId, nextCouponIds),
      options,
    });
  };

  return {
    getCheckoutCouponAsyncState,
    updateApplyCouponAsyncState,
    requestUpdateCheckoutApplyCoupon,
  };
};

export default useCheckoutCoupon;
