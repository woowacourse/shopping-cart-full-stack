import { http, HttpResponse } from "msw";

import { handlers as cartsHandlers } from "./carts";
import { handlers as shippingFeeHandlers } from "./shippingFee";
import { handlers as couponsHandlers } from "./coupons";
import { handlers as orderSheetsHandlers } from "./orderSheets";

export const handlers = [
  http.get("/health", () => {
    return HttpResponse.json({});
  }),
  ...cartsHandlers,
  ...shippingFeeHandlers,
  ...couponsHandlers,
  ...orderSheetsHandlers,
];
