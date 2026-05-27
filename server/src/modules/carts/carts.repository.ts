import { CartDB } from "@db/inMemoryDB";

export const getCartsQuery = () => {
  // 장바구니 조회
  const carts = [...CartDB];

  return carts;
};
