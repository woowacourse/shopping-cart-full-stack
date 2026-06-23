import { useEffect } from 'react';

import { useQuery } from '../../../shared/hooks/useQuery';
import { useOrderContext } from '../contexts/OrderContext';

export function useOrderCoupons() {
  const {
    orderId,
    order,
    coupons,
    fetchCoupons,
    dispatchOrderAction,
  } = useOrderContext();
  const queryKey = [
    'orderCoupons',
    orderId,
    order?.isRemoteArea,
    order?.amount.discountAmount,
  ].join(':');
  const {
    data: fetchedCoupons,
    isPending,
    error,
  } = useQuery(queryKey, () => fetchCoupons(orderId));

  useEffect(() => {
    if (!fetchedCoupons) return;

    dispatchOrderAction({ type: 'SET_COUPONS', coupons: fetchedCoupons });
  }, [fetchedCoupons, dispatchOrderAction]);

  return {
    isPending: isPending || (!!fetchedCoupons && coupons !== fetchedCoupons),
    error,
  };
}
