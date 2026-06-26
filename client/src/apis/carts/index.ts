import type { Cart } from "@/types/cartProduct";
import fetcher from "@apis/instance";

const CARTS_API = "/carts";

interface GetCartResponse {
  status: "success" | "error";
  message: string;
  data: Cart[];
}

export const getCart = async () => {
  const { data } = await fetcher.get<GetCartResponse>(`${CARTS_API}`);
  return data;
};
