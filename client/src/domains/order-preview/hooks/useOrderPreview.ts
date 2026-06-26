import {useCallback, useEffect, useRef, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import type {CouponId} from '../../coupon/domain/types.js';
import {previewOrder} from '../api/orderPreviewApi.js';
import type {PreviewOrder} from '../domain/types.js';

export type OrderPreviewStatus = 'loading' | 'success' | 'error';
export type OrderPreviewErrorType = 'default' | 'expired' | 'notFound';

export type OrderPreviewError = {
  message: string;
  type: OrderPreviewErrorType;
};

interface UseOrderPreviewOptions {
  enabled?: boolean;
  keepPrevious?: boolean;
}

interface UseOrderPreviewParams extends UseOrderPreviewOptions {
  preorderId: string | undefined;
  isRemoteArea: boolean;
  couponIds: CouponId[];
}

export function useOrderPreview({
  preorderId,
  isRemoteArea,
  couponIds,
  enabled = true,
  keepPrevious = true,
}: UseOrderPreviewParams) {
  const [orderPreview, setOrderPreview] = useState<PreviewOrder | null>(null);
  const [error, setError] = useState<OrderPreviewError | null>(null);
  const [status, setStatus] = useState<OrderPreviewStatus>('loading');
  const couponIdsKey = couponIds.join(',');
  const latestRequestId = useRef(0);

  const loadOrderPreview = useCallback(async () => {
    if (!enabled) return;

    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    if (!preorderId) {
      setError({
        message: '주문 확인 정보를 찾을 수 없습니다.',
        type: 'notFound',
      });
      setOrderPreview(null);
      setStatus('error');
      return;
    }

    setError(null);
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

      if (requestId !== latestRequestId.current) return;

      setOrderPreview(orderPreview);
      setStatus('success');
    } catch (error) {
      if (requestId !== latestRequestId.current) return;

      setError({
        message: getErrorMessage(error),
        type: getOrderPreviewErrorType(error),
      });
      setOrderPreview(null);
      setStatus('error');
    }
  }, [preorderId, isRemoteArea, couponIdsKey, enabled, keepPrevious]);

  useEffect(() => {
    void loadOrderPreview();
  }, [loadOrderPreview]);

  const resetOrderPreview = useCallback(() => {
    setOrderPreview(null);
    setError(null);
    setStatus('loading');
  }, []);

  return {
    orderPreview,
    status,
    error,
    loadOrderPreview,
    resetOrderPreview,
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '결제 금액을 계산하지 못했습니다.';
}

function getOrderPreviewErrorType(error: unknown): OrderPreviewErrorType {
  if (!(error instanceof ApiError)) return 'default';
  if (error.status === 410) return 'expired';
  if (error.status === 404) return 'notFound';

  return 'default';
}
