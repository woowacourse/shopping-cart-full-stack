export interface OrderContext {
  calculateOrderPrice: () => number;
  calculateDeliveryFee: () => number;
  findMostExpensiveItemPrice: (minQuantity: number) => number | undefined;
}
