import type { Order } from '../types/order.types';
import type { CartItemType } from '../types/product.types';
import { http, type APIResponse } from './api';

type GetOrderItemListResponse = {
  id: number;
  isRemoteArea: boolean;
  products: Order[];
  payment: {
    orderPrice: number;
    shippingFee: number;
    discountAmount: number;
    totalPrice: number;
  };
};
export const getOrderList = (
  id: number,
): Promise<APIResponse<GetOrderItemListResponse>> =>
  http.get<APIResponse<GetOrderItemListResponse>>(`/orders/${id}`);

type SelectedProducts = Pick<CartItemType, 'id' | 'orderCount'>;
type CreateOrderBody = {
  selectedProducts: SelectedProducts[];
};
export const createOrder = (
  selectedProducts: SelectedProducts[],
): Promise<
  APIResponse<{
    id: number;
  }>
> =>
  http.post<
    APIResponse<{
      id: number;
    }>,
    CreateOrderBody
  >('/orders', {
    selectedProducts,
  });

type UpdateUpdatedOrderResponse = { id: number; isRemoteArea: boolean };
export const updateOrder = (
  id: number,
  isRemoteArea: boolean,
): Promise<APIResponse<UpdateUpdatedOrderResponse>> =>
  http.patch<APIResponse<UpdateUpdatedOrderResponse>>(`/orders/${id}`, {
    isRemoteArea,
  });
