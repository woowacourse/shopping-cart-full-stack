import type { CouponCode } from '../../../entities/coupon/types';
import type { Order } from '../../../entities/order/types';
import { setQueryData } from '../../../shared/hooks/useQuery';
import { useOrderContext } from '../contexts/OrderContext';

export function useCouponActions() {
  const {
    orderId,
    selectedCouponCodes,
    isMutationLoading,
    mutate,
    fetchOrder,
    calculateDiscount,
    updateCoupons,
    dispatchOrderAction,
  } = useOrderContext();

  const openCouponModal = () => {
    dispatchOrderAction({ type: 'OPEN_COUPON_MODAL' });
  };

  const closeCouponModal = () => {
    dispatchOrderAction({ type: 'CLOSE_COUPON_MODAL' });
  };

  const changeCouponSelection = async (
    couponCode: CouponCode,
    checked: boolean,
  ) => {
    const nextCouponCodes = checked
      ? [...selectedCouponCodes, couponCode]
      : selectedCouponCodes.filter((code) => code !== couponCode);

    if (nextCouponCodes.length > 2 || isMutationLoading) return;

    const previousCouponCodes = selectedCouponCodes;
    dispatchOrderAction({
      type: 'CHANGE_COUPON_SELECTION',
      couponCodes: nextCouponCodes,
    });

    try {
      await mutate(() => calculateDiscount(orderId, nextCouponCodes), {
        onSuccess: (discount) => {
          dispatchOrderAction({
            type: 'SET_COUPON_DISCOUNT',
            discountAmount: discount.discountAmount,
          });
        },
        onError: () => {
          dispatchOrderAction({
            type: 'CHANGE_COUPON_SELECTION',
            couponCodes: previousCouponCodes,
          });
        },
      });
    } catch {
      return;
    }
  };

  const submitCoupons = async () => {
    if (isMutationLoading) return;

    try {
      await mutate(
        async () => {
          await updateCoupons(orderId, selectedCouponCodes);
          return fetchOrder(orderId);
        },
        {
          onSuccess: (order) => {
            dispatchOrderAction({ type: 'SET_ORDER', order });
            setQueryData<Order>(`order:${orderId}`, () => order);
            dispatchOrderAction({ type: 'CLOSE_COUPON_MODAL' });
          },
        },
      );
    } catch {
      return;
    }
  };

  return {
    openCouponModal,
    closeCouponModal,
    changeCouponSelection,
    submitCoupons,
  };
}
