export type OrderResponse = {
  orderId: string;
  products: {
    productId: string;
    productName: string;
    productPrice: number;
    imageUrl: string;
    quantity: number;
  }[];
  couponIds: string[];
  isIsland: boolean;
  priceInfo: {
    orderPrice: number;
    productDiscountPrice: number;
    deliveryDiscountPrice: number;
    deliveryFee: number;
    totalPrice: number;
  };
};

export type PostOrderRequest = {
  products: { productId: string; quantity: number }[];
};

export type PostOrderResponse = {
  orderId: string;
};

export type PatchOrderRequest = {
  couponIds: string[];
  isIsland: boolean;
};

export type PatchOrderResponse = {
  priceInfo: {
    orderPrice: number;
    productDiscountPrice: number;
    deliveryDiscountPrice: number;
    deliveryFee: number;
    totalPrice: number;
  };
};

export type GetDiscountPriceRequest = {
  couponIds: string[];
};
