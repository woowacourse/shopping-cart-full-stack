import { useEffect } from "react";
import {
  getCheckoutContent,
  updateCheckoutRemoteArea,
  type CheckoutContent,
  type CheckoutRemoteAreaResponse,
} from "../../domain/checkout/checkout.api";
import useAsyncTask, {
  type ExecuteAsyncFunctionProps,
} from "../../shared/useAsyncTask";

export const useCheckoutContent = (checkoutId: number) => {
  const {
    asyncState: getCheckoutContentAsyncState,
    executeAsyncFunction: executeGetCheckoutContent,
    setData: setCheckoutContent,
  } = useAsyncTask<CheckoutContent>();
  const updateCheckoutRemoteAreaAsyncTask =
    useAsyncTask<CheckoutRemoteAreaResponse>();

  useEffect(() => {
    executeGetCheckoutContent({
      asyncFunction: () => getCheckoutContent(checkoutId),
      options: {
        onFail: (error) => alert(error.message),
      },
    });
  }, [executeGetCheckoutContent]);

  const requestUpdateCheckoutRemoteArea = async (
    nextRemoteArea: boolean,
    options: ExecuteAsyncFunctionProps<CheckoutRemoteAreaResponse>["options"],
  ) => {
    updateCheckoutRemoteAreaAsyncTask.executeAsyncFunction({
      asyncFunction: () => updateCheckoutRemoteArea(checkoutId, nextRemoteArea),
      options,
    });
  };

  const applyRemoteAreaResult = ({
    remoteArea,
    couponDiscountPrice,
    deliveryFee,
    totalPrice,
  }: {
    remoteArea: boolean;
    couponDiscountPrice: number;
    deliveryFee: number;
    totalPrice: number;
  }) => {
    updateCheckoutContent({
      remoteArea,
      couponDiscountPrice,
      deliveryFee,
      totalPrice,
    });
  };

  const applyCheckoutCouponResult = ({
    appliedCouponIds,
    couponDiscountPrice,
    deliveryFee,
    totalPrice,
  }: Pick<
    CheckoutContent,
    "appliedCouponIds" | "couponDiscountPrice" | "deliveryFee" | "totalPrice"
  >) => {
    updateCheckoutContent({
      appliedCouponIds,
      couponDiscountPrice,
      deliveryFee,
      totalPrice,
    });
  };

  const updateCheckoutContent = (updateContent: Partial<CheckoutContent>) => {
    const checkoutContent = getCheckoutContentAsyncState.data;
    if (checkoutContent) {
      setCheckoutContent({ ...checkoutContent, ...updateContent });
    }
  };

  return {
    getCheckoutContentAsyncState,
    requestUpdateCheckoutRemoteArea,
    remoteAreaAsyncState: updateCheckoutRemoteAreaAsyncTask.asyncState,
    applyRemoteAreaResult,
    applyCheckoutCouponResult,
  };
};
