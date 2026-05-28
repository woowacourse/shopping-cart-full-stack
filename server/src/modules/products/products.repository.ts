import type { Product } from "@/type";
import { ProductDB } from "@db/inMemoryDB";

const makeCrateId = () => {
  const lastCount = { count: 0 };

  return function () {
    return lastCount.count++;
  };
};

const createId = makeCrateId();

export const getAllProductsQuery = () => {
  // 상품 목록 조회
  const products = [...ProductDB.values()];

  return products;
};

export const addProductQuery = (product: Omit<Product, "id">) => {
  const id = createId();
  const newProducts: Product = {
    id,
    ...product,
  };

  ProductDB.set(id, newProducts);

  return newProducts;
};

export const getProductByNameQuery = (name: string) => {
  const product = [...ProductDB.values()].find(
    (product) => product.name === name,
  );

  return product;
};

export const getProductByIdQuery = (id: number) => {
  const product = [...ProductDB.values()].find((product) => product.id === id);

  return product;
};

export const deleteProductQuery = (id: number) => {
  ProductDB.delete(id);

  return id;
};
