import type {
  GetCartsParams,
  PatchCartsProductsCommand,
  DeleteCartsProductsParams,
} from "./repository.types";

import type { GetCartsResponseDto, PatchCartsProductsResponseDto } from "./dto";

// GetCarts
export const mapGetCartsModelToRequestDTO = (
  model: GetCartsParams,
): GetCartsParams => {
  return model;
};
export const mapGetCartsResponseDTOToModel = (
  response: GetCartsResponseDto,
) => {
  return response.data;
};

// PatchCartsProducts
export const mapPatchCartsProductsModelToRequestDTO = (
  model: PatchCartsProductsCommand,
): PatchCartsProductsCommand => {
  return model;
};
export const mapPatchCartsProductsResponseDTOToModel = (
  response: PatchCartsProductsResponseDto,
) => {
  return response.data;
};

// DeleteCartsProducts
export const mapDeleteCartsProductsModelToRequestDTO = (
  model: DeleteCartsProductsParams,
): DeleteCartsProductsParams => {
  return model;
};
export const mapDeleteCartsProductsResponseDTOToModel = (
  response: undefined,
) => {
  return response;
};
