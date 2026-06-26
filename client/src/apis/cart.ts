import { API_BASE_URL } from './config';

export interface Product {
  id: string;
  name: string;
  price: number;
  thumbnail: string;
}

export interface CartItemResponse {
  product: Product;
  quantity: number;
}

export interface CartItemQuantityResponse {
  productId: string;
  quantity: number;
}

export const getCartItems = async (): Promise<CartItemResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/api/cart/`);

  if (!response.ok) {
    throw new Error('장바구니 상품 목록을 불러오지 못했습니다.');
  }

  const data = await response.json();

  return data.items;
};

export const deleteCartItems = async (productId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/api/cart/items/${productId}/`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('장바구니 상품을 제거하지 못했습니다.');
  }
};

export const patchCartItemQuantity = async (
  productId: string,
  quantity: number,
): Promise<CartItemQuantityResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/cart/items/${productId}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw new Error('장바구니 상품 수량을 변경하지 못했습니다.');
  }

  const data = await response.json();

  return {
    productId: data.product_id,
    quantity: data.quantity,
  };
};
