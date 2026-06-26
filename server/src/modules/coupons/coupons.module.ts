import { InMemoryCouponRepository } from "./repository/coupons.repository";
import { CouponsService } from "./service/coupons.service";
import { CouponsController } from "./controller/coupons.controller";

const couponRepository = new InMemoryCouponRepository();

export const couponService = new CouponsService(couponRepository);

export const couponsController = new CouponsController(couponService);
