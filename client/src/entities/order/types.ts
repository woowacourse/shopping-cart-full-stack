export type CreateOrderItem = {
  productId: string;
  quantity: number;
};

export type CreateOrderResponse = {
  id: string;
};

export type OrderProduct = {
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
};

export type OrderAmount = {
  orderAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
};

export type Order = {
  products: OrderProduct[];
  isRemoteArea: boolean;
  amount: OrderAmount;
};

export type CheckoutState = {
  productTypeCount: number;
  productCount: number;
  totalAmount: number;
};
