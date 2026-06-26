import type { Product } from "@/types/cartProduct";
import fetcher from "@apis/instance";

const PRODUCTS_API = "/products";

interface GetProductsResponse {
  status: "success" | "error";
  message: string;
  data: Product[];
}

export const getProducts = async () => {
  const { data } = await fetcher.get<GetProductsResponse>(`${PRODUCTS_API}`);
  return data;
};

interface PostProductResponse {
  status: "success" | "error";
  message: string;
  data: Product;
}

export const postProduct = async (product: Omit<Product, "id">) => {
  const { data } = await fetcher.post<PostProductResponse>(
    `${PRODUCTS_API}`,
    product,
  );
  return data;
};
