import { couponService } from "../coupons/coupons.module";
import { productsService } from "../products/products.module";
import { OrdersController } from "./controller/orders.controller";
import { InMemoryOrderRepository } from "./repository/orders.repository";
import { OrdersService } from "./service/orders.service";

export const ordersRepository = new InMemoryOrderRepository();

export const ordersService = new OrdersService(
  ordersRepository,
  couponService,
  productsService,
);

couponService.setOrderContextProvider(ordersService);

export const ordersController = new OrdersController(ordersService);
