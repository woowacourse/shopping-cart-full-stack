export const shoppingCartApi = {
  get: () => fetch("/cart"),
  post: (body: {}) =>
    fetch("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  delete: (cartItemId: number) =>
    fetch(`/cart/${cartItemId}`, { method: "DELETE" }),
};
