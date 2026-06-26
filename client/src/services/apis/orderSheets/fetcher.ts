import { requestAjax } from "@/services/core/http";

import type {
  // GetOrderSheet
  GetOrderSheetRequestDTO,
  GetOrderSheetResponseDTO,

  // PostOrderSheet
  PostOrderSheetRequestDTO,
  PostOrderSheetResponseDTO,

  // GetOrderSheetPricing
  GetOrderSheetPricingRequestDTO,
  GetOrderSheetPricingResponseDTO,

  // PatchOrderSheetShippingArea
  PatchOrderSheetShippingAreaRequestDTO,
  PatchOrderSheetShippingAreaResponseDTO,

  // PatchOrderSheetCoupons
  PatchOrderSheetCouponsRequestDTO,
  PatchOrderSheetCouponsResponseDTO,

  // GetOrderSheetAbleCoupons
  GetOrderSheetAbleCouponsRequestDTO,
  GetOrderSheetAbleCouponsResponseDTO,

  // PostOrderSheetCouponsDiscountPreview
  PostOrderSheetCouponsDiscountPreviewRequestDTO,
  PostOrderSheetCouponsDiscountPreviewResponseDTO,
} from "./dto";

// getOrderSheet
export const getOrderSheet = async ({
  pathParams: [{ value: id }],
}: GetOrderSheetRequestDTO): Promise<GetOrderSheetResponseDTO> => {
  const response = await requestAjax("/order-sheet", {
    method: "get",
    pathParams: [{ name: "id", value: id }],
  });

  return response.data;
};

// postOrderSheet
export const postOrderSheet = async ({
  pathParams: [{ value: cartId }],
  data: { productIds },
}: PostOrderSheetRequestDTO): Promise<PostOrderSheetResponseDTO> => {
  const response = await requestAjax("/order-sheet", {
    method: "post",
    pathParams: [{ name: "cartId", value: cartId }],
    data: {
      productIds,
    },
  });

  return response.data;
};

// GetOrderSheetPricing
export const getOrderSheetPricing = async ({
  pathParams: [{ value: id }],
}: GetOrderSheetPricingRequestDTO): Promise<GetOrderSheetPricingResponseDTO> => {
  const response = await requestAjax(`/order-sheet/${id}/pricing`, {
    method: "get",
  });

  return response.data;
};

// PatchOrderSheetShippingArea
export const patchOrderSheetShippingArea = async ({
  pathParams: [{ value: id }],
  data: { isRemoteShippingArea },
}: PatchOrderSheetShippingAreaRequestDTO): Promise<PatchOrderSheetShippingAreaResponseDTO> => {
  const response = await requestAjax(`/order-sheet/${id}/shipping-area`, {
    method: "patch",
    data: { isRemoteShippingArea },
  });

  return response.data;
};

// PatchOrderSheetCoupons
export const patchOrderSheetCoupons = async ({
  pathParams: [{ value: id }],
  data: { selectedCoupons },
}: PatchOrderSheetCouponsRequestDTO): Promise<PatchOrderSheetCouponsResponseDTO> => {
  const response = await requestAjax(`/order-sheet/${id}/coupons`, {
    method: "patch",
    data: { selectedCoupons },
  });

  return response.data;
};

// GetOrderSheetAbleCoupons
export const getOrderSheetAbleCoupons = async ({
  pathParams: [{ value: id }],
}: GetOrderSheetAbleCouponsRequestDTO): Promise<GetOrderSheetAbleCouponsResponseDTO> => {
  const response = await requestAjax(`/order-sheet/${id}/able-coupons`, {
    method: "get",
  });

  return response.data;
};

// PostOrderSheetCouponsDiscountPreview
export const postOrderSheetCouponsDiscountPreview = async ({
  pathParams: [{ value: id }],
  data: { selectedCoupons },
}: PostOrderSheetCouponsDiscountPreviewRequestDTO): Promise<PostOrderSheetCouponsDiscountPreviewResponseDTO> => {
  const response = await requestAjax(
    `/order-sheet/${id}/coupon-discount-preview`,
    {
      method: "post",
      data: { selectedCoupons },
    },
  );

  return response.data;
};
