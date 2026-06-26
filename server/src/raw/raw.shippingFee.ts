interface RawShippingFee {
  base: number;
  extra: number;
}

const createShippingFee = () => {
  const rawShippingFee: RawShippingFee = {
    base: 3000,
    extra: 3000,
  };
  return rawShippingFee;
};

export const shippingFeeStore = {
  shippingFee: createShippingFee(),
  reset() {
    this.shippingFee = createShippingFee();
  },
};
