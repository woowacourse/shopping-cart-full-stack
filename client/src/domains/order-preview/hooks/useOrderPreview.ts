import {useCallback, useEffect, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import type {CouponId} from '../../coupon/domain/types.js';
import {previewOrder, type PreviewOrderResponse} from '../api/orderPreviewApi.js';

export type OrderPreviewStatus = 'loading' | 'success' | 'error';
export type OrderPreviewErrorType = 'default' | 'expired' | 'notFound';

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
  const [errorType, setErrorType] = useState<OrderPreviewErrorType>('default');
  const [status, setStatus] = useState<OrderPreviewStatus>('loading');

  const loadOrderPreview = useCallback(async () => {
    if (!enabled) return;

    if (!preorderId) {
      setErrorMessage('주문 확인 정보를 찾을 수 없습니다.');
      setErrorType('notFound');
      setOrderPreview(null);
      setStatus('error');
      return;
    }

    setErrorMessage('');
    setErrorType('default');
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
      setErrorType(getOrderPreviewErrorType(error));
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
    setErrorType('default');
    setStatus('loading');
  }, []);

  return {
    orderPreview,
    status,
    errorMessage,
    errorType,
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
