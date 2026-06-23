import type { CartItem } from '../types';
import { API_BASE_URL } from '../../../shared/config/env';

export async function fetchCartItems(): Promise<CartItem[]> {
  const response = await fetch(`${API_BASE_URL}/carts`);

  if (!response.ok) {
    throw new Error('장바구니 목록을 불러오지 못했습니다.');
  }

  return response.json();
}

export async function updateCartItemQuantity(id: string, quantity: number) {
  const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error('상품 수량을 변경하지 못했습니다.');
  }
}

export async function updateCartItemSelection(
  id: string,
  isSelected: boolean,
) {
  const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isSelected }),
  });

  if (!response.ok) {
    throw new Error('상품 선택 상태를 변경하지 못했습니다.');
  }
}

export async function updateAllCartItemsSelection(isSelected: boolean) {
  const response = await fetch(`${API_BASE_URL}/carts`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isSelected }),
  });

  if (!response.ok) {
    throw new Error('전체 상품 선택 상태를 변경하지 못했습니다.');
  }
}

export async function deleteCartItem(id: string) {
  const response = await fetch(`${API_BASE_URL}/carts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('상품을 삭제하지 못했습니다.');
  }
}
