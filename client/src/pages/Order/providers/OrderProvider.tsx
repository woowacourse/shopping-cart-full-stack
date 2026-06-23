import { useCallback, useEffect, useReducer, type ReactNode } from 'react';

import {
  initialOrderState,
  orderReducer,
  type OrderAction,
} from '../../../entities/order/orderReducer';
import type { Order } from '../../../entities/order/types';
import type {
  Coupon,
  CouponCode,
  CouponDiscount,
} from '../../../entities/coupon/types';
import { useMutation } from '../../../shared/hooks/useMutation';
import { useQuery } from '../../../shared/hooks/useQuery';
import { OrderContext } from '../contexts/OrderContext';

type OrderProviderProps = {
  children: ReactNode;
  orderId: string;
  fetchOrder: (id: string) => Promise<Order>;
  updateRemoteArea: (id: string, isRemoteArea: boolean) => Promise<void>;
  fetchCoupons: (id: string) => Promise<Coupon[]>;
  calculateDiscount: (
    id: string,
    coupons: CouponCode[],
  ) => Promise<CouponDiscount>;
  updateCoupons: (id: string, coupons: CouponCode[]) => Promise<void>;
};

export default function OrderProvider({
  children,
  orderId,
  fetchOrder,
  updateRemoteArea,
  fetchCoupons,
  calculateDiscount,
  updateCoupons,
}: OrderProviderProps) {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);
  const {
    data: fetchedOrder,
    isPending,
    error,
  } = useQuery(`order:${orderId}`, () => fetchOrder(orderId));
  const {
    mutate,
    isPending: isMutationLoading,
    error: mutationError,
  } = useMutation();

  const dispatchOrderAction = useCallback((action: OrderAction) => {
    dispatch(action);
  }, []);

  useEffect(() => {
    dispatch({ type: 'RESET_ORDER' });
  }, [orderId]);

  useEffect(() => {
    if (fetchedOrder) {
      dispatch({ type: 'SET_ORDER', order: fetchedOrder });
    }
  }, [fetchedOrder]);

  return (
    <OrderContext
      value={{
        ...state,
        orderId,
        isPending,
        error,
        mutationError,
        isMutationLoading,
        mutate,
        fetchOrder,
        updateRemoteArea,
        fetchCoupons,
        calculateDiscount,
        updateCoupons,
        dispatchOrderAction,
      }}
    >
      {children}
    </OrderContext>
  );
}
