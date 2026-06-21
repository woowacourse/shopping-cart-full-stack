import type {PropsWithChildren} from 'react';

import {OrderPreviewContext} from '../contexts/OrderPreviewContext.js';
import {useOrderPreviewPageState} from '../hooks/useOrderPreviewPageState.js';

export function OrderPreviewProvider({children}: PropsWithChildren) {
  const orderPreview = useOrderPreviewPageState();

  return <OrderPreviewContext.Provider value={orderPreview}>{children}</OrderPreviewContext.Provider>;
}
