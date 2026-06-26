import {createContext, type PropsWithChildren} from 'react';

import {useOrderPreviewPageState, type OrderPreviewPageState} from '../hooks/useOrderPreviewPageState.js';

export const OrderPreviewContext = createContext<OrderPreviewPageState | null>(null);

export function OrderPreviewProvider({children}: PropsWithChildren) {
  const orderPreview = useOrderPreviewPageState();

  return <OrderPreviewContext.Provider value={orderPreview}>{children}</OrderPreviewContext.Provider>;
}
