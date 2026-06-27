import type { ServerCart, ServerCartProduct } from "./carts.type";

export const makeServerCartProduct = (
  id: number,
  name: string,
  price: number,
  quantity: number,
): ServerCartProduct => ({
  id,
  name,
  price,
  imgUrl: `https://example.com/${id}.jpg`,
  quantity,
});

export const DEFAULT_CART_PRODUCTS: ServerCartProduct[] = [
  makeServerCartProduct(1, "무선 헤드폰", 129000, 1),
  makeServerCartProduct(2, "러닝화", 89000, 2),
];

// Stateful cart data for testing
export const cart: ServerCart = {
  id: 1,
  products: JSON.parse(JSON.stringify(DEFAULT_CART_PRODUCTS)),
};

// Reset state for tests
export function seedCarts(nextProducts: ServerCartProduct[] = DEFAULT_CART_PRODUCTS) {
  cart.products = JSON.parse(JSON.stringify(nextProducts));
}

// For backward compatibility / direct access in some files
export const cartProducts = cart.products;
