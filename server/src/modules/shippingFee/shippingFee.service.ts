import type { ShippingFeeResponse } from "./shippingFee.dto.ts";
import * as shippingFeeRepository from "./shippingFee.repository.ts";

export const getShippingFee = (): ShippingFeeResponse => {
  const shippingFee = shippingFeeRepository.find();
  return { shippingFee: shippingFee.base };
};
