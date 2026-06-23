import { useOrderContext } from '../contexts/OrderContext';

export function useOrder() {
  const {
    order,
    isPending,
    error,
    isModalOpen,
    coupons,
    selectedCouponCodes,
    couponDiscountAmount,
    isMutationLoading,
  } = useOrderContext();

  return {
    order,
    isPending,
    error,
    isModalOpen,
    coupons,
    selectedCouponCodes,
    couponDiscountAmount,
    isMutationLoading,
  };
}
