import { createContext, useContext } from 'react';

import type {
  OrderAction,
  OrderState,
} from '../../../entities/order/orderReducer';
import type {
  Coupon,
  CouponCode,
  CouponDiscount,
} from '../../../entities/coupon/types';
import type { Order } from '../../../entities/order/types';
import type { Mutate } from '../../../shared/hooks/useMutation';

export type OrderContextValue = OrderState & {
  orderId: string;
  isPending: boolean;
  error: Error | null;
  mutationError: Error | null;
  isMutationLoading: boolean;
  mutate: Mutate;
  fetchOrder: (id: string) => Promise<Order>;
  updateRemoteArea: (id: string, isRemoteArea: boolean) => Promise<void>;
  fetchCoupons: (id: string) => Promise<Coupon[]>;
  calculateDiscount: (
    id: string,
    coupons: CouponCode[],
  ) => Promise<CouponDiscount>;
  updateCoupons: (id: string, coupons: CouponCode[]) => Promise<void>;
  dispatchOrderAction: (action: OrderAction) => void;
};

export const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrderContext() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error('useOrderContext는 OrderProvider 안에서 사용해야 합니다.');
  }

  return context;
}
