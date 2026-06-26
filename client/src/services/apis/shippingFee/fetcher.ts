import { requestAjax } from "@/services/core/http";

export const getShippingFee = async () => {
  const response = await requestAjax("/shipping-fee", {
    method: "get",
  });

  return response.data;
};
