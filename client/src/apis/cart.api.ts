import type { CartItemsResponseDto, ErrorResponseDto } from "./cart.api.dto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const NETWORK_ERROR_CODE = "네트워크 에러가 발생했습니다." as const;

export class NetworkError extends Error {
  constructor() {
    super(NETWORK_ERROR_CODE);
  }
}

export async function getCartItems(): Promise<CartItemsResponseDto> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/cart`);
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    const error: ErrorResponseDto = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}

export async function updateCartItemQuantity(
  id: number,
  quantity: number,
): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    const error: ErrorResponseDto = await response.json();
    throw new Error(error.message);
  }
}

export async function deleteCartItem(id: number): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/cart/${id}`, {
      method: "DELETE",
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    const error: ErrorResponseDto = await response.json();
    throw new Error(error.message);
  }
}
