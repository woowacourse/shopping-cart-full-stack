import type { CartItem, Cart } from '../types';
import { BASE_URL } from './client';

type GetCartResponse = {
  status: 200;
  data: Cart;
};

type UpdateCheckResponse = {
  status: 200;
  data: {
    isAllSelected: boolean;
    cartItem: CartItem;
  };
};

type UpdateCheckAllResponse = {
  status: 200;
  data: {
    isAllSelected: boolean;
    cartItems: CartItem[];
  };
};

type UpdateCartQuantityResponse = {
  status: 200;
  data: CartItem;
};

type DeleteCartItemResponse = {
  status: 200;
  data: { deletedProductId: string };
};

export const getCart = async (): Promise<Cart> => {
  const response = await fetch(`${BASE_URL}/cart`);

  if (!response.ok) {
    throw new Error('장바구니 조회에 실패했습니다.');
  }
  const result: GetCartResponse = await response.json();
  return result.data;
};

export const updateCartSelect = async (productId: string, checkStatus: boolean) => {
  const response = await fetch(`${BASE_URL}/carts/select/product/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkStatus }),
  });

  if (!response.ok) {
    throw new Error('상품 선택에 실패했습니다.');
  }

  const result: UpdateCheckResponse = await response.json();
  return result.data;
};
export const updateCartSelectAll = async (checkStatus: boolean) => {
  const response = await fetch(`${BASE_URL}/carts/select`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkStatus }),
  });

  if (!response.ok) {
    throw new Error('전체 상품 선택에 실패했습니다.');
  }

  const result: UpdateCheckAllResponse = await response.json();
  return result.data;
};

export const updateCartQuantity = async (
  productId: string,
  quantity: number,
): Promise<CartItem> => {
  const response = await fetch(`${BASE_URL}/carts/products/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error('수량 변경에 실패했습니다.');
  }

  const result: UpdateCartQuantityResponse = await response.json();
  return result.data;
};

export const deleteCartItem = async (productId: string) => {
  const response = await fetch(`${BASE_URL}/cart/product/${productId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('장바구니 아이템 삭제에 실패했습니다.');
  }

  const result: DeleteCartItemResponse = await response.json();
  return result.data;
};
