import type { GetCouponsResponseDto } from "./dto";
import type { Coupon } from "../../../pages/orderReview/OrderReview.types";

// GetCoupons
export const mapGetCouponsResponseDTOToModel = (
  response: GetCouponsResponseDto,
): { coupons: Coupon[] } => {
  const coupons = response.data.coupons.map(
    (coupon: GetCouponsResponseDto["data"]["coupons"][number]) => {
      return {
        id: coupon.id,
        name: coupon.name,
        code: coupon.code,
        expirationDate: coupon.expirationDate,

        ...(coupon.minimumOrderAmount
          ? { minOrderAmount: coupon.minimumOrderAmount }
          : {}),

        ...(coupon.validityPeriod
          ? {
              validTime: {
                start: coupon.validityPeriod.startsAt,
                end: coupon.validityPeriod.endsAt,
              },
            }
          : {}),
      };
    },
  );

  return { coupons };
};
