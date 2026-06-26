import type { Order, OrderProduct, PriceInfo } from "@/types/order";
import fetcher from "@apis/instance";

const ORDER_API = "/order";

interface GetOrderResponse {
  status: "success" | "error";
  message: string;
  data: Order;
}

export const getOrder = async () => {
  const { data } = await fetcher.get<GetOrderResponse>(`${ORDER_API}`);
  return data;
};

interface PostOrderResponse {
  status: "success" | "error";
  message: string;
  data: {
    orderId: string;
  };
}

export interface PostOrderRequest {
  orderProducts: Pick<OrderProduct, "productId" | "quantity">[];
}

export const postOrder = async ({ orderProducts }: PostOrderRequest) => {
  const { data } = await fetcher.post<PostOrderResponse>(`${ORDER_API}`, {
    orderProducts,
  });
  return data;
};

interface PatchOrderResponse {
  status: "success" | "error";
  message: string;
  data: {
    priceInfo: PriceInfo;
  };
}

export type PatchOrderRequest = { couponIds: string[] } | { isIsland: boolean };

export const patchOrder = async (body: PatchOrderRequest) => {
  const { data } = await fetcher.patch<PatchOrderResponse>(
    `${ORDER_API}`,
    body,
  );
  return data;
};
