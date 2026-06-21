import {requestApi} from '../../shared/api/requestApi.js';

const ORDER_API_ERROR_MESSAGE = '주문 요청에 실패했습니다.';

export interface CreateOrderRequestBody {
  preorderId: string;
  expectedTotalPaymentAmount: number;
}

export interface CreateOrderResponse {
  orderId: string;
}

export async function createOrder(body: CreateOrderRequestBody): Promise<CreateOrderResponse> {
  return requestApi<CreateOrderResponse>('/order', {
    errorMessage: ORDER_API_ERROR_MESSAGE,
    method: 'POST',
    body: JSON.stringify(body),
  });
}
