import { ApiError, apiRequest } from "../../../shared/api/httpClient";
import { z } from "../../../shared/schema";
import { couponSchema, type Coupon } from "../types";

const couponListSchema = z.array(couponSchema);

export async function getCoupons(): Promise<Coupon[]> {
  const data = await apiRequest("/coupons");
  const result = couponListSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(
      500,
      "InvalidResponse",
      "쿠폰 응답 형식이 올바르지 않습니다",
    );
  }
  return result.data;
}
