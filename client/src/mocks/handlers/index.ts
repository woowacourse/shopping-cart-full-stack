import { productHandlers } from "./products";
import { cartHandlers } from "./carts";
import { orderHandlers } from "./orders";

export const handlers = [...productHandlers, ...cartHandlers, ...orderHandlers];
