import type { PreorderResponse } from "@cart/shared";
import type { PreorderApiInterface } from "../interfaces/PreorderApiInterface";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const fetchPreorderApi: PreorderApiInterface = {
  createPreorder: async (
    selectedCartIds: number[],
  ): Promise<{ preorderId: string }> => {
    const response = await fetch(`${BASE_URL}/preorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedCartIds }),
    });
    if (!response.ok) throw new Error("주문서 생성에 실패했습니다.");
    return response.json();
  },

  getPreorder: async (preorderId: string): Promise<PreorderResponse> => {
    const response = await fetch(`${BASE_URL}/preorder/${preorderId}`);
    if (!response.ok) throw new Error("주문서를 불러올 수 없습니다.");
    return response.json();
  },
};
