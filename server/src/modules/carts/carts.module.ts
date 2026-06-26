import { InMemoryCartRepository } from "./repository/carts.repository";
import { CartsController } from "./controller/carts.controller";
import { CartsService } from "./service/carts.service";

export const cartsRepository = new InMemoryCartRepository();
export const cartsService = new CartsService(cartsRepository);
export const cartsController = new CartsController(cartsService);
