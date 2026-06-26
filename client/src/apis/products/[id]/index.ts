import fetcher from "@apis/instance";

const PRODUCTS_API = "/products";

interface DeleteProductResponse {
  status: "success" | "error";
  message: string;
  data: {
    id: number;
  };
}

export const deleteProduct = async (id: number) => {
  const { data } = await fetcher.delete<DeleteProductResponse>(
    `${PRODUCTS_API}/${id}`,
  );
  return data;
};
