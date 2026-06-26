import { ShippingFee } from "./shippingFee.model.ts";
import { shippingFeeStore } from "../../raw/raw.shippingFee.ts";

export const find = () => {
  const base = shippingFeeStore.shippingFee.base;

  return new ShippingFee({ base });
};
