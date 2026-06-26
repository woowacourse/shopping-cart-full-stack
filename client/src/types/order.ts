export interface OrderProduct {
  productId: string;
  productName: string;
  productPrice: number;
  imgUrl: string;
  quantity: number;
}

export interface PriceInfo {
  orderPrice: number;
  discountPrice: number;
  deliveryFee: number;
  totalPrice: number;
}

export interface Order {
  orderId: string;
  orderProducts: OrderProduct[];
  isIsland: boolean;
  couponIds: string[];
  priceInfo: PriceInfo;
}
