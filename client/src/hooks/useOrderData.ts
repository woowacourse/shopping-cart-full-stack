import { orderApi } from "../api/orderApi";
import { OrderData } from "../type/types";
import useFetch from "./useFetch";

export default function useOrderData(orderId: number) {
  const { state, fetchData } = useFetch<OrderData>(() => orderApi.get(orderId));

  const orderData = state.status === "success" ? state.data : undefined;
  //payment 요청시 (결제하기 버튼 눌렀을 때!)
  const onDelete = async (orderId: number) => {
    try {
      const res = await orderApi.delete(orderId);
      if (!res.ok) throw new Error();
      fetchData();
    } catch (error) {}
  };

  const updateAppliedCoupon = async (orderId: number, couponIds: number[]) => {
    try {
      const res = await orderApi.applyCoupon(orderId, couponIds);
      if (!res.ok) throw new Error();
      fetchData();
    } catch (error) {}
  };

  return {
    orderState: state,
    orderData,
    onDelete,
    updateAppliedCoupon,
    orderFetchData: fetchData,
  };
}
