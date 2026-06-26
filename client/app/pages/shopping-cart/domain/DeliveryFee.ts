class DeliveryFee {
  constructor(
    private readonly price: number,
    private readonly freeThreshold: number,
  ) {
    this.price = price;
    this.freeThreshold = freeThreshold;
  }

  public calculate(itemTotal: number) {
    return itemTotal >= this.freeThreshold ? 0 : this.price;
  }
}

export default DeliveryFee;
