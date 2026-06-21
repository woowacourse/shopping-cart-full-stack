import {useCallback, useEffect, useState} from 'react';

import {ApiError} from '../../shared/api/requestApi.js';
import {getPreorder, type Preorder} from '../api/orderApi.js';

type PreorderStatus = 'loading' | 'success' | 'error';
export type PreorderErrorType = 'default' | 'expired' | 'notFound';

export function usePreorder(preorderId: string | undefined) {
  const [preorder, setPreorder] = useState<Preorder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<PreorderErrorType>('default');

  const loadPreorder = useCallback(async () => {
    if (!preorderId) {
      setErrorMessage('주문 확인 정보를 찾을 수 없습니다.');
      setErrorType('notFound');
      return;
    }

    setErrorMessage('');
    setErrorType('default');
    setPreorder(null);

    try {
      const preorder = await getPreorder(preorderId);

      setPreorder(preorder);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setErrorType(getPreorderErrorType(error));
    }
  }, [preorderId]);

  useEffect(() => {
    void loadPreorder();
  }, [loadPreorder]);

  const status = getPreorderStatus(preorder, errorMessage);

  return {
    preorder,
    status,
    errorMessage,
    errorType,
    loadPreorder,
  };
}

function getPreorderStatus(preorder: Preorder | null, errorMessage: string): PreorderStatus {
  if (errorMessage) return 'error';
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
