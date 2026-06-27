import type { RequestHandler } from "express";
import { validateCreatePayment } from "./payments.schema";
import { createPayment } from "./payments.service";

export const postPayment: RequestHandler = async (req, res) => {
  console.log("POST /payments 요청 수신:", req.body);
  const body = validateCreatePayment(req.body);
  const result = await createPayment(body);

  res.status(201).json({
    status: "success",
    data: result,
  });
};
