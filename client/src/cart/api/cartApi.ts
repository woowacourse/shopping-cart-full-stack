import type {CartItem, CartItemId} from '../domain/types.js';
import {requestApi, requestApiWithoutBody} from '../../shared/api/requestApi.js';

const CART_API_ERROR_MESSAGE = '장바구니 요청에 실패했습니다.';

type UpdatedCartItemQuantityResponse = Pick<CartItem, 'id' | 'quantity'>;

export async function getCartItems(): Promise<CartItem[]> {
  return requestApi<CartItem[]>('/carts', {
    errorMessage: CART_API_ERROR_MESSAGE,
  });
}

export async function updateCartItemQuantity(
  cartItemId: CartItemId,
  quantity: CartItem['quantity']
): Promise<UpdatedCartItemQuantityResponse> {
  return requestApi<UpdatedCartItemQuantityResponse>(`/carts/${cartItemId}`, {
    errorMessage: CART_API_ERROR_MESSAGE,
    method: 'PATCH',
    body: JSON.stringify({quantity}),
  });
}

export async function deleteCartItem(cartItemId: CartItemId): Promise<void> {
  await requestApiWithoutBody(`/carts/${cartItemId}`, {
    errorMessage: CART_API_ERROR_MESSAGE,
    method: 'DELETE',
  });
}
