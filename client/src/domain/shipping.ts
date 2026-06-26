const DEFAULT_SHIPPING_POLICY = {
  freeShippingThreshold: 100_000,
  shippingFee: 3_000,
} as const;

export const getShippingPolicy = () => DEFAULT_SHIPPING_POLICY;

export const calculateShippingFee = (orderAmount: number) => {
  const { freeShippingThreshold, shippingFee } = getShippingPolicy();

  return orderAmount >= freeShippingThreshold ? 0 : shippingFee;
};
