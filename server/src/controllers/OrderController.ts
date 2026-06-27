import type { Request, Response } from "express";

import { orderService } from "../container.js";

export const orderController = {
  async previewOrder(req: Request, res: Response) {
    const mode = req.query.mode === "auto" ? "auto" : "manual";

    const result = await orderService.previewOrder(req.body, { mode });

    res.status(200).json(result);
  },
};
