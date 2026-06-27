import { DEFAULT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, REMOTE_AREA_SHIPPING_FEE } from "./constants.js";

export function getShippingFee(isRemoteArea: boolean, orderAmount: number) {
  if (orderAmount >= FREE_SHIPPING_THRESHOLD) return 0;
  if (isRemoteArea) return REMOTE_AREA_SHIPPING_FEE;

  return DEFAULT_SHIPPING_FEE;
}
