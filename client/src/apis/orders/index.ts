import fetcher from "@apis/instance";
import type { PostOrderRequest, PostOrderResponse } from "@/types/order";
import { mapPostOrderRequestToServer, mapServerPostOrderResponseToResponse } from "./dto";
import type { ServerPostOrderResponse } from "./dto";

export const ORDERS_API = "/orders";

export const postOrder = async (body: PostOrderRequest): Promise<PostOrderResponse> => {
  const serverReq = mapPostOrderRequestToServer(body);
  const response = await fetcher.post<ServerPostOrderResponse>(ORDERS_API, serverReq);

  return mapServerPostOrderResponseToResponse(response);
};
