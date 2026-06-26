import type { ResponseDTO } from "@/services/apis/api.types";

// GetOrderSheet
export interface GetOrderSheetRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
}

export type GetOrderSheetResponseDTO = ResponseDTO<
  200,
  {
    orderSheet: {
      items: [
        {
          product: {
            id: number;
            name: string;
            price: number;
            imgUrl: string;
          };
          quantity: number;
        },
      ];
      isRemoteShippingArea: boolean;
      selectedCoupons: number[];
    };
  }
>;

// PostOrderSheet
export interface PostOrderSheetRequestDTO {
  pathParams: [
    {
      name: "cartId";
      value: number;
    },
  ];
  data: {
    productIds: number[];
  };
}

export type PostOrderSheetResponseDTO = ResponseDTO<
  200,
  {
    id: number;
  }
>;

// GetOrderSheetPricing
export interface GetOrderSheetPricingRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
}

export type GetOrderSheetPricingResponseDTO = ResponseDTO<
  200,
  {
    pricing: {
      orderAmount: number;
      couponDiscountAmount: number;
      shippingFee: number;
      paymentAmount: number;
    };
  }
>;

// PatchOrderSheetShippingArea
export interface PatchOrderSheetShippingAreaRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
  data: {
    isRemoteShippingArea: boolean;
  };
}

export type PatchOrderSheetShippingAreaResponseDTO = ResponseDTO<200, unknown>;

// PatchOrderSheetCoupons
export interface PatchOrderSheetCouponsRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
  data: {
    selectedCoupons: number[];
  };
}

export type PatchOrderSheetCouponsResponseDTO = ResponseDTO<200, unknown>;

// GetOrderSheetAbleCoupons
export interface GetOrderSheetAbleCouponsRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
}

export type GetOrderSheetAbleCouponsResponseDTO = ResponseDTO<
  200,
  { able: string[] }
>;

// GetOrderSheetCouponsDiscountPreview
export interface PostOrderSheetCouponsDiscountPreviewRequestDTO {
  pathParams: [
    {
      name: "id";
      value: number;
    },
  ];
  data: {
    selectedCoupons: number[];
  };
}

export type PostOrderSheetCouponsDiscountPreviewResponseDTO = ResponseDTO<
  200,
  { couponDiscountAmount: number }
>;
