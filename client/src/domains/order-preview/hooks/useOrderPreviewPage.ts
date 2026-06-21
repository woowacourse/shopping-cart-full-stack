import {useContext} from 'react';

import {OrderPreviewContext} from '../providers/OrderPreviewProvider.js';

export function useOrderPreviewPage() {
  const orderPreview = useContext(OrderPreviewContext);

  if (orderPreview === null) {
    throw new Error('useOrderPreviewPage는 OrderPreviewProvider 안에서만 사용할 수 있습니다.');
  }

  return orderPreview;
}
