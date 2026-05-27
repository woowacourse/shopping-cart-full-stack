import { ProductDB } from "@db/inMemoryDB";

export const getAllProductsQuery = () => {
  // 상품 목록 조회
  const products = [...ProductDB.values()];

  return products;
};
