import { deleteCheckout, getCheckout, submitPayment } from "../apis/checkout/checkout";
import { checkoutQueryKey } from "../constants/queryKeys";
import { useMyQuery } from "../lib/myQuery/useMyQuery";
import type { Checkout, PaymentSummary } from "../domain/checkout";

export function useCheckout(checkoutId: number) {
  const queryKey = checkoutQueryKey(checkoutId);
  const { data, isLoading, hasError, refetch } = useMyQuery<Checkout>(queryKey, () => getCheckout(checkoutId));

  const cancelCheckout = async () => {
    return await deleteCheckout(checkoutId);
  };

  const submitCheckout = (): Promise<PaymentSummary> => {
    if (!data) throw new Error("주문 정보가 아직 로드되지 않았습니다.");

    const selectedCouponIds = data.coupons.filter((coupon) => coupon.isSelected).map((coupon) => coupon.id);

    return submitPayment(checkoutId, data.remoteArea, selectedCouponIds);
  };

  return {
    isLoading,
    hasError,
    checkoutItemList: data?.items ?? [],
    couponList: data?.coupons ?? [],
    orderAmount: data?.checkoutAmount ?? 0,
    couponDiscount: data?.couponDiscount ?? 0,
    shippingFee: data?.shippingFee ?? 0,
    totalAmount: data?.totalAmount ?? 0,
    remoteArea: data?.remoteArea ?? false,
    refetch,
    cancelCheckout,
    submitCheckout,
  };
}
