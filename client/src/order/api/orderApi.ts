import type {CartItemId} from '../../cart/domain/types.js';
import {requestApi} from '../../shared/api/requestApi.js';

type CreatePreorderResponse = {
  preorderId: string;
};

export async function createPreorder(selectedCartIds: CartItemId[]): Promise<CreatePreorderResponse> {
  return requestApi('/preorder', {
    method: 'POST',
    body: JSON.stringify({selectedCartIds}),
  });
}
