export interface StoredOrder {
  orderId: number;
  items: Array<{ productId: number; quantity: number }>;
  appliedCoupon: number[];
  remoteArea: boolean; //제주도, 도서산간 지역
}
