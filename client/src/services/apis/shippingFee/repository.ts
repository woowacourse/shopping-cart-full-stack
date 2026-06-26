import * as fetcher from "./fetcher";
import { mapGetShippingFeeResponseDTOToModel } from "./mapper";

import type { GetShippingFee } from "./repository.types";

export const getShippingFee: GetShippingFee = async () => {
  const responseDTO = await fetcher.getShippingFee();

  return mapGetShippingFeeResponseDTOToModel(responseDTO.data);
};
