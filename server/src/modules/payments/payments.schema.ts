import { AppError } from "@/errors/AppError";

export interface CreatePaymentBody {
  orderId: number;
  amount: number;
}

export const validateCreatePayment = (body: unknown): CreatePaymentBody => {
  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as Record<string, unknown>).orderId !== "number" ||
    typeof (body as Record<string, unknown>).amount !== "number"
  ) {
    throw new AppError("INVALID_PAYMENT");
  }
  return body as CreatePaymentBody;
};
