import { API_BASE_URL } from '../../../shared/config/env';
import type {
  CreateOrderItem,
  CreateOrderResponse,
  Order,
} from '../types';

export async function createOrder(
  items: CreateOrderItem[],
): Promise<CreateOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw new Error('주문을 생성하지 못했습니다.');
  }

  return response.json();
}

export async function fetchOrder(id: string): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`);

  if (!response.ok) {
    throw new Error('주문서를 불러오지 못했습니다.');
  }

  return response.json();
}

export async function updateOrderRemoteArea(
  id: string,
  isRemoteArea: boolean,
) {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isRemoteArea }),
  });

  if (!response.ok) {
    throw new Error('배송 정보를 변경하지 못했습니다.');
  }
}
