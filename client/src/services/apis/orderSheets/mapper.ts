import type {
  GetOrderSheetParams,
  PostOrderSheetCommand,
  GetOrderSheetPricingParams,
  PatchOrderSheetShippingAreaCommand,
  PatchOrderSheetCouponsCommand,
  GetOrderSheetAbleCouponsParams,
  PostOrderSheetCouponsDiscountPreviewParams,
} from "./repository.types";

import type {
  GetOrderSheetResponseDTO,
  PostOrderSheetResponseDTO,
  GetOrderSheetPricingResponseDTO,
  PatchOrderSheetShippingAreaResponseDTO,
  PatchOrderSheetCouponsResponseDTO,
  GetOrderSheetAbleCouponsResponseDTO,
  PostOrderSheetCouponsDiscountPreviewResponseDTO,
} from "./dto";

import type {
  OrderSheetProduct,
  IsRemoteArea,
  SelectedCoupon,
} from "../../../pages/orderReview/OrderReview.types";

// GetOrderSheet
export const mapGetOrderSheetModelToRequestDTO = (
  model: GetOrderSheetParams,
): GetOrderSheetParams => {
  return model;
};

export const mapGetOrderSheetResponseDTOToModel = (
  response: GetOrderSheetResponseDTO,
): {
  products: OrderSheetProduct[];
  isRemoteArea: IsRemoteArea;
  selectedCoupons: SelectedCoupon[];
} => {
  return {
    products: response.data.orderSheet.items.map((item) => {
      const { product } = item;
      return {
        id: product.id,
        quantity: item.quantity,
        name: product.name,
        price: product.price,
        imgUrl: product.imgUrl,
      };
    }),
    isRemoteArea: response.data.orderSheet.isRemoteShippingArea,
    selectedCoupons: response.data.orderSheet.selectedCoupons,
  };
};

// PostOrderSheet

export const mapPostOrderSheetModelToRequestDTO = (
  model: PostOrderSheetCommand,
): PostOrderSheetCommand => {
  return model;
};

export const mapPostOrderSheetResponseDTOToModel = (
  response: PostOrderSheetResponseDTO,
) => {
  return response.data;
};

// GetOrderSheetPricing
export const mapGetOrderSheetPricingModelToRequestDTO = (
  model: GetOrderSheetPricingParams,
): GetOrderSheetPricingParams => {
  return model;
};

export const mapGetOrderSheetPricingResponseDTOToModel = (
  response: GetOrderSheetPricingResponseDTO,
) => {
  return {
    orderSheetAmount: response.data.pricing.orderAmount,
    discountAmount: response.data.pricing.couponDiscountAmount,
    shippingFee: response.data.pricing.shippingFee,
    paymentAmount: response.data.pricing.paymentAmount,
  };
};

// PatchOrderSheetShippingArea

export const mapPatchOrderSheetShippingAreaModelToRequestDTO = (
  model: PatchOrderSheetShippingAreaCommand,
): { id: number; isRemoteShippingArea: boolean } => {
  return {
    id: model.id,
    isRemoteShippingArea: model.isRemoteArea,
  };
};

export const mapPatchOrderSheetShippingAreaResponseDTOToModel = (
  response: PatchOrderSheetShippingAreaResponseDTO,
) => {
  return response.data;
};

// PatchOrderSheetCoupons

export const mapPatchOrderSheetCouponsModelToRequestDTO = (
  model: PatchOrderSheetCouponsCommand,
): PatchOrderSheetCouponsCommand => {
  return {
    id: model.id,
    selectedCoupons: model.selectedCoupons,
  };
};

export const mapPatchOrderSheetCouponsResponseDTOToModel = (
  response: PatchOrderSheetCouponsResponseDTO,
) => {
  return response.data;
};

// GetOrderSheetAbleCoupons
export const mapGetOrderSheetAbleCouponsModelToRequestDTO = (
  model: GetOrderSheetAbleCouponsParams,
): GetOrderSheetAbleCouponsParams => {
  return model;
};

export const mapGetOrderSheetAbleCouponsResponseDTOToModel = (
  response: GetOrderSheetAbleCouponsResponseDTO,
) => {
  return {
    ableCoupons: response.data.able,
  };
};

// PostOrderSheetCouponsDiscountPreview
export const mapPostOrderSheetCouponsDiscountPreviewModelToRequestDTO = (
  model: PostOrderSheetCouponsDiscountPreviewParams,
): PostOrderSheetCouponsDiscountPreviewParams => {
  return model;
};

export const mapPostOrderSheetCouponsDiscountPreviewResponseDTOToModel = (
  response: PostOrderSheetCouponsDiscountPreviewResponseDTO,
) => {
  return {
    discountAmount: response.data.couponDiscountAmount,
  };
};
