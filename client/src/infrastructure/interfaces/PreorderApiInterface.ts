import type { PreorderResponse } from "@cart/shared";

export interface PreorderApiInterface {
  createPreorder(selectedCartIds: number[]): Promise<{ preorderId: string }>;
  getPreorder(preorderId: string): Promise<PreorderResponse>;
}
