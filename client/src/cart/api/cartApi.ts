import type {CartItem, CartItemId} from '../domain/types.js';
import {requestApi, requestApiWithoutBody} from '../../shared/api/requestApi.js';

type UpdatedCartItemQuantityResponse = Pick<CartItem, 'id' | 'quantity'>;

export async function getCartItems(): Promise<CartItem[]> {
  return requestApi('/carts');
}

export async function updateCartItemQuantity(
  cartItemId: CartItemId,
  quantity: CartItem['quantity']
): Promise<UpdatedCartItemQuantityResponse> {
  return requestApi(`/carts/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify({quantity}),
  });
}

export async function deleteCartItem(cartItemId: CartItemId): Promise<void> {
  await requestApiWithoutBody(`/carts/${cartItemId}`, {
    method: 'DELETE',
  });
}
