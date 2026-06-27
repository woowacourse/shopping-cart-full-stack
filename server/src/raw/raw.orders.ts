export interface RawOrderProduct {
  id: number;
  quantity: number;
}

export interface RawOrder {
  id: number;
  products: RawOrderProduct[];
  couponIds: number[];
  isRemoteArea: boolean;
  deliveryFee: number;
  createdAt: Date;
}

export const rawOrders: RawOrder[] = [];

let snapshot: RawOrder[] = [];

export const transaction = () => {
  // 깊은 복사 (Date 객체 유지)
  snapshot = rawOrders.map(order => ({
    ...order,
    products: order.products.map(p => ({ ...p })),
    couponIds: [...order.couponIds],
    createdAt: new Date(order.createdAt.getTime())
  }));
};

export const rollback = () => {
  // 메모리 주소 유지
  rawOrders.splice(0, rawOrders.length, ...snapshot);
};
