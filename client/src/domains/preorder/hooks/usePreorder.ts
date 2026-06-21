import {useCallback, useEffect, useState} from 'react';

import {ApiError} from '../../../shared/api/requestApi.js';
import {getPreorder} from '../api/preorderApi.js';
import type {Preorder} from '../domain/types.js';

export type PreorderStatus = 'loading' | 'success' | 'error';
export type PreorderErrorType = 'default' | 'expired' | 'notFound';

export type PreorderError = {
  message: string;
  type: PreorderErrorType;
};

export function usePreorder(preorderId: string | undefined) {
  const [preorder, setPreorder] = useState<Preorder | null>(null);
  const [error, setError] = useState<PreorderError | null>(null);

  const loadPreorder = useCallback(async () => {
    if (!preorderId) {
      setError({
        message: '주문 확인 정보를 찾을 수 없습니다.',
        type: 'notFound',
      });
      return;
    }

    setError(null);
    setPreorder(null);

    try {
      const preorder = await getPreorder(preorderId);

      setPreorder(preorder);
    } catch (requestError) {
      setError({
        message: getErrorMessage(requestError),
        type: getPreorderErrorType(requestError),
      });
    }
  }, [preorderId]);

  useEffect(() => {
    void loadPreorder();
  }, [loadPreorder]);

  const status = getPreorderStatus(preorder, error);

  return {
    preorder,
    status,
    error,
    loadPreorder,
  };
}

function getPreorderStatus(preorder: Preorder | null, error: PreorderError | null): PreorderStatus {
  if (error) return 'error';
  if (preorder) return 'success';

  return 'loading';
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '주문 확인 정보를 불러오지 못했습니다.';
}

function getPreorderErrorType(error: unknown): PreorderErrorType {
  if (!(error instanceof ApiError)) return 'default';
  if (error.status === 410) return 'expired';
  if (error.status === 404) return 'notFound';

  return 'default';
}
