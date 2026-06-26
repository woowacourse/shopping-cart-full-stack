export interface DeliveryFeePolicy {
  calculate: (fee: number, orderPrice: number) => number;
}

export class DeliveryFee {
  constructor(
    private readonly baseFee: number,
    private readonly policies: DeliveryFeePolicy[],
    private readonly hardPlace: boolean = false,
  ) {}

  getDeliveryFee(orderPrice: number) {
    return this.policies.reduce(
      (fee, p) => (fee += p.calculate(fee, orderPrice)),
      this.baseFee,
    );
  }

  isHardPlace() {
    return this.hardPlace;
  }
}

export class HardPlacePolicy implements DeliveryFeePolicy {
  constructor(private readonly hardPlaceExtraFee: number) {}

  calculate() {
    return this.hardPlaceExtraFee;
  }
}

export class FreeDeliveryPolicy implements DeliveryFeePolicy {
  constructor(private readonly threshold: number) {}

  calculate(fee: number, orderPrice: number) {
    if (orderPrice >= this.threshold) {
      return -fee;
    }
    return 0;
  }
}
