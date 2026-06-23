import type { Order } from '../../../entities/order/types';
import { setQueryData } from '../../../shared/hooks/useQuery';
import { useOrderContext } from '../contexts/OrderContext';

export function useRemoteAreaActions() {
  const {
    order,
    orderId,
    isMutationLoading,
    mutate,
    fetchOrder,
    updateRemoteArea,
    dispatchOrderAction,
  } = useOrderContext();

  const changeRemoteArea = async (isRemoteArea: boolean) => {
    if (isMutationLoading || !order) return;

    const previousOrder = order;
    dispatchOrderAction({ type: 'CHANGE_REMOTE_AREA', isRemoteArea });

    try {
      await mutate(
        async () => {
          await updateRemoteArea(orderId, isRemoteArea);
          return fetchOrder(orderId);
        },
        {
          onSuccess: (order) => {
            dispatchOrderAction({ type: 'SET_ORDER', order });
            setQueryData<Order>(`order:${orderId}`, () => order);
          },
          onError: () => {
            dispatchOrderAction({ type: 'SET_ORDER', order: previousOrder });
          },
        },
      );
    } catch {
      return;
    }
  };

  return {
    changeRemoteArea,
  };
}
