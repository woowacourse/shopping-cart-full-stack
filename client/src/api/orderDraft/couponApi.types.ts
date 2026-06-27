export type CouponResponse = {
  couponList: {
    couponId: string;
    couponName: string;
    couponDescription: string;
    isDisabled: boolean;
    couponExpiration: string;
  }[];
};

export type PreviewRequest = {
  couponIds: string[];
};

export type PreviewResponse = {
  couponIds: string[];
  productDiscountPrice: number;
  deliveryDiscountPrice: number;
  totalDiscountPrice: number;
};
