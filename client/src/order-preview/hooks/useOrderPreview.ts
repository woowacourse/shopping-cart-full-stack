import {useCallback, useEffect, useState} from 'react';

import type {CouponId} from '../../coupon/domain/types.js';
import {previewOrder, type PreviewOrderResponse} from '../api/orderPreviewApi.js';

export type OrderPreviewStatus = 'loading' | 'success' | 'error';

interface UseOrderPreviewOptions {
  enabled?: boolean;
  keepPrevious?: boolean;
}

export function useOrderPreview(
  preorderId: string | undefined,
  isRemoteArea: boolean,
  couponIds: CouponId[],
  {enabled = true, keepPrevious = false}: UseOrderPreviewOptions = {}
) {
  const [orderPreview, setOrderPreview] = useState<PreviewOrderResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState<OrderPreviewStatus>('loading');

  const loadOrderPreview = useCallback(async () => {
    if (!enabled) return;

    if (!preorderId) {
      setErrorMessage('주문 확인 정보를 찾을 수 없습니다.');
      setOrderPreview(null);
      setStatus('error');
      return;
    }

    setErrorMessage('');
    setStatus('loading');

    if (!keepPrevious) {
      setOrderPreview(null);
    }

    try {
      const orderPreview = await previewOrder({
        preorderId,
        isRemoteArea,
        couponIds,
      });

      setOrderPreview(orderPreview);
      setStatus('success');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setOrderPreview(null);
      setStatus('error');
    }
  }, [preorderId, isRemoteArea, couponIds, enabled, keepPrevious]);

  useEffect(() => {
    void loadOrderPreview();
  }, [loadOrderPreview]);

  const resetOrderPreview = useCallback(() => {
    setOrderPreview(null);
    setErrorMessage('');
    setStatus('loading');
  }, []);

  return {
    orderPreview,
    status,
    errorMessage,
    loadOrderPreview,
    resetOrderPreview,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '결제 금액을 계산하지 못했습니다.';
}
