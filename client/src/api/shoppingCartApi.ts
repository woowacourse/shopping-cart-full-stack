export const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const shoppingCartApi = {
  get: () => fetch(`${BASE_URL}/cart`),

  post: (body: {}) =>
    fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  delete: (cartItemId: number) =>
    fetch(`${BASE_URL}/cart/${cartItemId}`, { method: "DELETE" }),

  patch: (cartItemId: number, quantity: number) =>
    fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }),
};
