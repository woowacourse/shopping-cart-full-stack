import type { ResponseDTO } from "@/services/apis/api.types";

export type GetShippingFeeResponseDto = ResponseDTO<
  200,
  {
    shippingFee: number;
  }
>;
