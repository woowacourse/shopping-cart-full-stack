import type { Request, Response } from "express";

import { success } from "../../common/response.ts";
import * as shippingFeeService from "./shippingFee.service.ts";

export const getShippingFee = (_req: Request, res: Response) => {
  const shippingFee = shippingFeeService.getShippingFee();

  return success(res, shippingFee);
};
