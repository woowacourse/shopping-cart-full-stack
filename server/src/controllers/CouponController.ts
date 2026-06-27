import type { Request, Response } from "express";

import { couponService } from "../container.js";

export const couponController = {
  async getCoupons(_req: Request, res: Response) {
    res.status(200).json(await couponService.getCoupons());
  },
};
