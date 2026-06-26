import { createApp } from "../route.js";
import {
  createCartController,
  createProductController,
  createTempOrderController,
  createDiscountSummaryController,
  createCouponController,
} from "./controllers.js";
import {
  InMemoryCartRepository,
  InMemoryProductRepository,
  InMemoryTempOrderRepository,
  InMemoryCouponRepository,
} from "./repositories/InMemoryRepositories.js";

export function createShopApp() {
  const productRepository = new InMemoryProductRepository();
  const cartRepository = new InMemoryCartRepository();
  const tempOrderRepository = new InMemoryTempOrderRepository();
  const couponRepository = new InMemoryCouponRepository();

  const productController = createProductController({ productRepository, cartRepository });
  const cartController = createCartController({ cartRepository, productRepository });
  const tempOrderController = createTempOrderController({ tempOrderRepository, productRepository, couponRepository });
  const discountSummaryController = createDiscountSummaryController({ tempOrderRepository, couponRepository });
  const couponController = createCouponController({ couponRepository, tempOrderRepository });

  const app = createApp({ productController, cartController, tempOrderController, discountSummaryController, couponController });

  return { app, productRepository, cartRepository, tempOrderRepository, couponRepository };
}
