import type { ResponseDTO } from "@/services/apis/api.types";

export type GetCouponsResponseDto = ResponseDTO<
  200,
  {
    coupons: {
      id: number;
      name: string;
      code: string;
      expirationDate: string;
      minimumOrderAmount?: number;
      validityPeriod?: {
        startsAt: string;
        endsAt: string;
      };
    }[];
  }
>;
