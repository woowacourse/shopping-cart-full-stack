import type {CartItemId} from '../../cart/domain/types.js';
import {requestApi} from '../../shared/api/requestApi.js';
import type {Preorder} from '../domain/types.js';

const PREORDER_API_ERROR_MESSAGE = '주문 확인 정보 요청에 실패했습니다.';

type CreatePreorderResponse = {
  preorderId: string;
};

export async function createPreorder(selectedCartIds: CartItemId[]): Promise<CreatePreorderResponse> {
  return requestApi<CreatePreorderResponse>('/preorder', {
    errorMessage: PREORDER_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify({selectedCartIds}),
  });
}

export async function getPreorder(preorderId: string): Promise<Preorder> {
  return requestApi<Preorder>(`/preorder/${encodeURIComponent(preorderId)}`, {
    errorMessage: PREORDER_API_ERROR_MESSAGE,
  });
}
