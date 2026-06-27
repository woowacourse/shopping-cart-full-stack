import type { CartItemRepository } from "./repositories/CartItemRepository.js";
import type { CouponRepository } from "./repositories/CouponRepository.js";
import type { ProductRepository } from "./repositories/ProductRepository.js";
import { InMemoryCartItemRepository } from "./repositories/memory/InMemoryCartItemRepository.js";
import { InMemoryCouponRepository } from "./repositories/memory/InMemoryCouponRepository.js";
import { InMemoryProductRepository } from "./repositories/memory/InMemoryProductRepository.js";
import { SupabaseCartItemRepository } from "./repositories/supabase/SupabaseCartItemRepository.js";
import { SupabaseCouponRepository } from "./repositories/supabase/SupabaseCouponRepository.js";
import { SupabaseProductRepository } from "./repositories/supabase/SupabaseProductRepository.js";
import { createCartService } from "./services/CartService.js";
import { createCouponService } from "./services/CouponService.js";
import { createOrderService } from "./services/OrderService.js";
import { createProductService } from "./services/ProductService.js";

const resolveDataSource = (): "supabase" | "memory" => {
  const explicit = process.env.DATA_SOURCE?.toLowerCase();

  if (explicit === "supabase" || explicit === "memory") {
    return explicit;
  }

  return process.env.SUPABASE_URL ? "supabase" : "memory";
};

const dataSource = resolveDataSource();

const productRepository: ProductRepository =
  dataSource === "supabase"
    ? new SupabaseProductRepository()
    : new InMemoryProductRepository();

const cartItemRepository: CartItemRepository =
  dataSource === "supabase"
    ? new SupabaseCartItemRepository()
    : new InMemoryCartItemRepository();

const couponRepository: CouponRepository =
  dataSource === "supabase"
    ? new SupabaseCouponRepository()
    : new InMemoryCouponRepository();

export const productService = createProductService({
  productRepository,
  cartItemRepository,
});

export const cartService = createCartService({
  cartItemRepository,
  productRepository,
});

export const couponService = createCouponService({ couponRepository });

export const orderService = createOrderService({
  cartItemRepository,
  productRepository,
  couponRepository,
});

if (process.env.NODE_ENV !== "test") {
  console.log(`[container] data source: ${dataSource}`);
}
