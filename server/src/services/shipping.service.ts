export const FREE_SHIPPING_THRESHOLD = 100000;
export const SHIPPING_FEE = 3000;
export const REMOTE_AREA_FEE = 3000;

export function calculateShippingFee(checkoutAmount: number, remoteArea: boolean): number {
  if (checkoutAmount >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return SHIPPING_FEE + remoteAreaFee(remoteArea);
}

function remoteAreaFee(remoteArea: boolean): number {
  if (remoteArea) {
    return REMOTE_AREA_FEE;
  }
  return 0;
}
