import type { Payment } from '../types/payment.types';
import type { CartItemType } from '../types/product.types';
import { http, type APIResponse } from './api';

type GetCartItemListResponse = {
  cartItems: CartItemType[];
};
export const getCartList = (): Promise<APIResponse<GetCartItemListResponse>> =>
  http.get<APIResponse<GetCartItemListResponse>>('/carts');

export const deleteCartItem = (id: number): Promise<void> =>
  http.delete<void>(`/carts/${id}`);

type UpdateCartItemBody = { orderCount?: number; isSelected?: boolean };
type UpdateCartItemResponse = Pick<CartItemType, 'orderCount'>;
export const updateCartItem = (
  id: number,
  body: UpdateCartItemBody,
): Promise<APIResponse<UpdateCartItemResponse>> =>
  http.patch<APIResponse<UpdateCartItemResponse>>(`/carts/${id}`, body);

type GetCartPaymentsResponse = Payment;
export const getCartPayments = (): Promise<
  APIResponse<GetCartPaymentsResponse>
> => http.get<APIResponse<GetCartPaymentsResponse>>('/carts/payment');
