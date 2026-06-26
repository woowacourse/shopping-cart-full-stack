import { http, HttpResponse } from "msw";
import { withErrorHandling } from "./errors";
import { getCouponList } from "./services";

const API = "/api/coupons";

export const couponsHandlers = [
  // GET /coupons
  http.get(
    API,
    withErrorHandling(() =>
      HttpResponse.json({
        status: "success",
        message: "쿠폰 목록을 정상적으로 조회하였습니다.",
        data: { couponList: getCouponList() },
      }),
    ),
  ),
];
