import type { CalculatedPrice, OrderResponse } from "@cart/shared";

export interface OrderApiInterface {
  submitOrder(
    preorderId: string,
    couponIds: number[],
    isRemoteArea: boolean,
    expectedPriceSummary: CalculatedPrice,
  ): Promise<OrderResponse>;

  getOrder(orderId: number): Promise<OrderResponse>;
}
