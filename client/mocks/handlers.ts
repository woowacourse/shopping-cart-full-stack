import { http, HttpResponse } from "msw";
import { CartItem } from "../src/type/types";

export const mockCartItems: CartItem[] = [
  {
    cartItemId: 1,
    quantity: 1,
    productId: 101,
    productData: {
      productId: 101,
      name: "상품 A",
      price: 35000,
      thumbnailUrl: "",
      totalQuantity: 10,
    },
  },
  {
    cartItemId: 2,
    quantity: 1,
    productId: 102,
    productData: {
      productId: 102,
      name: "상품 B",
      price: 70000,
      thumbnailUrl: "",
      totalQuantity: 10,
    },
  },
];

let cartItems: CartItem[] = mockCartItems.map((item) => ({ ...item }));

export const resetCartItems = () => {
  cartItems = mockCartItems.map((item) => ({ ...item }));
};

export const handlers = [
  http.get("/cart", () => HttpResponse.json(cartItems)),

  http.patch("/cart/:id", async ({ request, params }) => {
    const { quantity } = (await request.json()) as { quantity: number };
    cartItems = cartItems.map((item) =>
      item.cartItemId === Number(params.id) ? { ...item, quantity } : item,
    );
    return new HttpResponse(null, { status: 200 });
  }),

  http.delete("/cart/:id", ({ params }) => {
    cartItems = cartItems.filter(
      (item) => item.cartItemId !== Number(params.id),
    );
    return new HttpResponse(null, { status: 204 });
  }),
];
