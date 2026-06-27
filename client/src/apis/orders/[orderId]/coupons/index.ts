import fetcher from "@apis/instance";
import type { GetCouponsResponse } from "@/types/order";
import { ORDERS_API } from "@apis/orders";
import { mapServerGetCouponsResponseToResponse } from "../../dto";
import type { ServerGetCouponsResponse } from "../../dto";

export const getCoupons = async (orderId: number): Promise<GetCouponsResponse> => {
  const response = await fetcher.get<ServerGetCouponsResponse>(`${ORDERS_API}/${orderId}/coupons`);
  return mapServerGetCouponsResponseToResponse(response);
};
