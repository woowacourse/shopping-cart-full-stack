import * as fetcher from "./fetcher";
import { mapGetCouponsResponseDTOToModel } from "./mapper";

import type { GetCoupons } from "./repository.types";

export const getCoupons: GetCoupons = async () => {
  const responseDTO = await fetcher.getCoupons();

  return mapGetCouponsResponseDTOToModel(responseDTO);
};
