import { BASE_URL } from "../../constants";
import { NetworkError } from "../../commons/errors";

export async function getCartItems() {
  try {
    const response = await fetch(`${BASE_URL}/api/cart/`);
    const data = await response.json();
    return data;
  } catch {
    throw new NetworkError();
  }
}

export async function deleteCartItem(id: string) {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/cart/items/${id}/`, {
      method: "DELETE",
    });
  } catch {
    throw new NetworkError();
  }
  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message);
  }
}

export async function createOrder(
  items: { product_id: string; quantity: number }[],
) {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/orders/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
  } catch {
    throw new NetworkError();
  }
  if (!response.ok) throw new Error("주문 생성 실패");
  const data = await response.json();
  return data;
}

export async function updateCartItem(id: string, body: { quantity: number }) {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/api/cart/items/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new NetworkError();
  }
  if (!response.ok) {
    const { errors } = await response.json();
    throw new Error(errors.message);
  }
  const data = await response.json();
  return data;
}
