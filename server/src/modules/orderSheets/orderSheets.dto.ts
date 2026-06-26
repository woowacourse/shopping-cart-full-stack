export interface OrderSheetResponse {
  orderSheet: {
    items: {
      product: {
        id: number;
        name: string;
        price: number;
        imgUrl: string;
      };
      quantity: number;
    }[];
    isRemoteShippingArea: boolean;
    selectedCoupons: number[];
  };
}

export interface CreateOrderSheetResponse {
  id: number;
}
