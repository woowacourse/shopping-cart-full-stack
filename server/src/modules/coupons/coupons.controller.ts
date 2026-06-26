import type { Request, Response } from "express";

import { success } from "../../common/response.ts";
import * as couponsService from "./coupons.service.ts";

export const getCoupons = (_req: Request, res: Response) => {
  const coupons = couponsService.getCoupons();

  return success(res, coupons);
};
