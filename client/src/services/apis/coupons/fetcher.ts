import { requestAjax } from "@/services/core/http";

export const getCoupons = async () => {
  const response = await requestAjax("/coupons", {
    method: "get",
  });

  return response.data;
};
