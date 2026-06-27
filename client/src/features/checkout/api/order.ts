import { ApiError, apiRequest } from "../../../shared/api/httpClient";
import { orderPreviewSchema, type OrderPreview } from "../types";

interface OrderPreviewRequest {
  selectedItemIds: string[];
  coupons: string[];
  isRemoteArea: boolean;
}

export async function postOrderPreview(
  body: OrderPreviewRequest,
  mode: "auto" | "manual" = "manual",
): Promise<OrderPreview> {
  const query = mode === "auto" ? "?mode=auto" : "";
  const data = await apiRequest(`/order/preview${query}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const result = orderPreviewSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      500,
      "InvalidResponse",
      "주문 미리보기 응답 형식이 올바르지 않습니다",
    );
  }
  return result.data;
}
