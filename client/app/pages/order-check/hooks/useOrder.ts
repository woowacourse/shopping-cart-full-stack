import { useState, useEffect } from "react";
import { Order } from "../types";
import { FetchStatus } from "../../../commons/types";
import { getOrder, updateOrder as updateOrderApi } from "../api";

export default function useOrder(orderId: string) {
  const [loadStatus, setLoadStatus] = useState<FetchStatus>("idle");
  const [order, setOrder] = useState<Order | null>(null);

  async function updateOrder(body: {
    selected_coupons?: string[];
    hard_delivery_place?: boolean;
  }) {
    const order = await updateOrderApi(orderId, body);
    setOrder(order);
  }

  useEffect(
    function loadOrder() {
      async function fetchOrder() {
        setLoadStatus("loading");
        try {
          const data = await getOrder(orderId);
          setOrder(data);
          setLoadStatus("success");
        } catch {
          setLoadStatus("error");
        }
      }
      fetchOrder();
    },
    [orderId],
  );

  return { loadStatus, order, updateOrder };
}
