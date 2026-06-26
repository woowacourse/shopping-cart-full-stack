import type { GetShippingFeeResponseDto } from "./dto";

// GetShippingFee

export const mapGetShippingFeeResponseDTOToModel = (
  response: GetShippingFeeResponseDto,
) => {
  return response.data;
};
