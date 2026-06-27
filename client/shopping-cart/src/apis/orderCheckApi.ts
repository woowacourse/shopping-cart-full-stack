import type { OrderCheck } from '../types';
import { BASE_URL } from './client';

type GetOrderCheckResponse = {
  status: 200;
  data: OrderCheck;
};

type SelectRemoteAreaResponse = {
  status: 200;
  data: { checkStatus: boolean };
};

export const createOrderCheck = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/order-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('주문 확인 생성에 실패했습니다.');
  }
};

export const getOrderCheck = async (): Promise<OrderCheck> => {
  const response = await fetch(`${BASE_URL}/order-check`);

  if (!response.ok) {
    throw new Error('주문 확인 상품 조회에 실패했습니다.');
  }

  const result: GetOrderCheckResponse = await response.json();
  return result.data;
};

export const selectRemoteArea = async (checkStatus: boolean): Promise<boolean> => {
  const response = await fetch(`${BASE_URL}/order-check/select/remote-areas`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkStatus }),
  });

  if (!response.ok) {
    throw new Error('도서 산간 지역 선택에 실패했습니다.');
  }

  const result: SelectRemoteAreaResponse = await response.json();
  return result.data.checkStatus;
};
