import type {CartItemId} from '../../cart/domain/types.js';
import {requestApi} from '../../shared/api/requestApi.js';

const ORDER_API_ERROR_MESSAGE = '주문 요청에 실패했습니다.';

type CreatePreorderResponse = {
  preorderId: string;
};

export type PreorderItem = {
  productId: string;
  price: number;
  name: string;
  imageUrl: string;
  quantity: number;
};

export type Preorder = {
  preorderId: string;
  items: PreorderItem[];
};

export async function createPreorder(selectedCartIds: CartItemId[]): Promise<CreatePreorderResponse> {
  return requestApi<CreatePreorderResponse>('/preorder', {
    errorMessage: ORDER_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify({selectedCartIds}),
  });
}

export async function getPreorder(preorderId: string): Promise<Preorder> {
  return requestApi<Preorder>(`/preorder/${encodeURIComponent(preorderId)}`, {
    errorMessage: ORDER_API_ERROR_MESSAGE,
  });
}
