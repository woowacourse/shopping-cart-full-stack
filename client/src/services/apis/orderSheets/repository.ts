import * as fetcher from "./fetcher";

import {
  // mapGetOrderSheet
  mapGetOrderSheetModelToRequestDTO,
  mapGetOrderSheetResponseDTOToModel,
  // mapPostOrderSheet
  mapPostOrderSheetModelToRequestDTO,
  mapPostOrderSheetResponseDTOToModel,
  // mapGetOrderSheetPricing
  mapGetOrderSheetPricingModelToRequestDTO,
  mapGetOrderSheetPricingResponseDTOToModel,
  // mapPatchOrderSheetShippingArea
  mapPatchOrderSheetShippingAreaModelToRequestDTO,

  // mapPatchOrderSheetCoupons
  mapPatchOrderSheetCouponsModelToRequestDTO,

  // mapGetOrderSheetAbleCoupons
  mapGetOrderSheetAbleCouponsModelToRequestDTO,
  mapGetOrderSheetAbleCouponsResponseDTOToModel,
  // mapPostOrderSheetCouponsDiscountPreview
  mapPostOrderSheetCouponsDiscountPreviewModelToRequestDTO,
  mapPostOrderSheetCouponsDiscountPreviewResponseDTOToModel,
} from "./mapper";

import type {
  GetOrderSheet,
  PostOrderSheet,
  GetOrderSheetPricing,
  PatchOrderSheetShippingArea,
  PatchOrderSheetCoupons,
  GetOrderSheetAbleCoupons,
  PostOrderSheetCouponsDiscountPreview,
} from "./repository.types";

export const getOrderSheet: GetOrderSheet = async (model) => {
  const { id } = mapGetOrderSheetModelToRequestDTO(model);

  const responseDTO = await fetcher.getOrderSheet({
    pathParams: [{ name: "id", value: id }],
  });

  return mapGetOrderSheetResponseDTOToModel(responseDTO);
};

export const postOrderSheet: PostOrderSheet = async (model) => {
  const { cartId, productIds } = mapPostOrderSheetModelToRequestDTO(model);

  const responseDTO = await fetcher.postOrderSheet({
    pathParams: [{ name: "cartId", value: cartId }],
    data: { productIds },
  });

  return mapPostOrderSheetResponseDTOToModel(responseDTO);
};

export const getOrderSheetPricing: GetOrderSheetPricing = async (model) => {
  const { id } = mapGetOrderSheetPricingModelToRequestDTO(model);

  const responseDTO = await fetcher.getOrderSheetPricing({
    pathParams: [{ name: "id", value: id }],
  });

  return mapGetOrderSheetPricingResponseDTOToModel(responseDTO);
};

export const patchOrderSheetShippingArea: PatchOrderSheetShippingArea = async (
  model,
) => {
  const { id, isRemoteShippingArea } =
    mapPatchOrderSheetShippingAreaModelToRequestDTO(model);

  await fetcher.patchOrderSheetShippingArea({
    pathParams: [{ name: "id", value: id }],
    data: { isRemoteShippingArea },
  });

  return;
};

export const patchOrderSheetCoupons: PatchOrderSheetCoupons = async (model) => {
  const { id, selectedCoupons } =
    mapPatchOrderSheetCouponsModelToRequestDTO(model);

  await fetcher.patchOrderSheetCoupons({
    pathParams: [{ name: "id", value: id }],
    data: { selectedCoupons },
  });

  return;
};

export const getOrderSheetAbleCoupons: GetOrderSheetAbleCoupons = async (
  model,
) => {
  const { id } = mapGetOrderSheetAbleCouponsModelToRequestDTO(model);

  const responseDTO = await fetcher.getOrderSheetAbleCoupons({
    pathParams: [{ name: "id", value: id }],
  });

  return mapGetOrderSheetAbleCouponsResponseDTOToModel(responseDTO);
};

export const postOrderSheetCouponsDiscountPreview: PostOrderSheetCouponsDiscountPreview =
  async (model) => {
    const { id, selectedCoupons } =
      mapPostOrderSheetCouponsDiscountPreviewModelToRequestDTO(model);

    const responseDTO = await fetcher.postOrderSheetCouponsDiscountPreview({
      pathParams: [{ name: "id", value: id }],
      data: { selectedCoupons },
    });

    return mapPostOrderSheetCouponsDiscountPreviewResponseDTOToModel(
      responseDTO,
    );
  };
