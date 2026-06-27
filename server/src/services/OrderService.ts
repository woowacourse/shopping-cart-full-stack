import { InvalidInputError, NotFoundError } from "../errors/HttpError.js";
import { z } from "../shared/schema/index.js";
import type { CartItemRepository } from "../repositories/CartItemRepository.js";
import type { CouponRepository } from "../repositories/CouponRepository.js";
import type { ProductRepository } from "../repositories/ProductRepository.js";
import { calculateOrder, sumOrderAmount } from "./order/calculateOrder.js";
import {
  inapplicableReasonOf,
  type CouponContext,
  type OrderLineItem,
} from "./order/couponPolicy.js";

const MAX_COUPONS_MANUAL = 2;

export type OrderPreviewMode = "auto" | "manual";

const orderPreviewBodySchema = z.object({
  selectedItemIds: z.array(z.string()),
  coupons: z.array(z.string()),
  isRemoteArea: z.boolean(),
});

type ParsedOrderPreview = z.infer<typeof orderPreviewBodySchema>;

const parseRequest = (
  body: unknown,
  mode: OrderPreviewMode,
): ParsedOrderPreview => {
  const result = orderPreviewBodySchema.safeParse(body);
  if (!result.success) {
    throw new InvalidInputError();
  }

  const { selectedItemIds, coupons, isRemoteArea } = result.data;

  // 선택 상품은 1개 이상이어야 한다 (배열 길이 체크는 스키마 밖에서)
  if (selectedItemIds.length === 0) {
    throw new InvalidInputError();
  }

  // manual 모드에서는 최대 2개까지만 허용 (auto 모드는 최적 조합 자동 선택을 위해 제한 없음)
  if (mode === "manual" && coupons.length > MAX_COUPONS_MANUAL) {
    throw new InvalidInputError();
  }

  return { selectedItemIds, coupons, isRemoteArea };
};

export interface OrderServiceDeps {
  cartItemRepository: CartItemRepository;
  productRepository: ProductRepository;
  couponRepository: CouponRepository;
}

export const createOrderService = ({
  cartItemRepository,
  productRepository,
  couponRepository,
}: OrderServiceDeps) => ({
  async previewOrder(body: unknown, options: { mode: OrderPreviewMode }) {
    const { selectedItemIds, coupons, isRemoteArea } = parseRequest(
      body,
      options.mode,
    );

    const allCartItems = await cartItemRepository.findAll();
    const cartItemById = new Map(
      allCartItems.map((cartItem) => [cartItem.id, cartItem]),
    );

    const selectedCartItems = selectedItemIds.map((id) => {
      const cartItem = cartItemById.get(id);
      if (!cartItem) {
        throw new NotFoundError();
      }
      return cartItem;
    });

    const allProducts = await productRepository.findAll();
    const productById = new Map(
      allProducts.map((product) => [product.id, product]),
    );

    const items: OrderLineItem[] = selectedCartItems.map((cartItem) => {
      const product = productById.get(cartItem.productId);
      if (!product) {
        throw new NotFoundError();
      }
      return {
        productId: cartItem.productId,
        price: product.price,
        quantity: cartItem.getQuantity(),
      };
    });

    const allCoupons = await couponRepository.findAll();
    const couponById = new Map(allCoupons.map((coupon) => [coupon.id, coupon]));

    const candidateCoupons = coupons.map((id) => {
      const coupon = couponById.get(id);
      if (!coupon) {
        throw new NotFoundError();
      }
      return coupon;
    });

    const now = new Date();
    const ctx: CouponContext = {
      orderAmount: sumOrderAmount(items),
      items,
      now,
    };
    const couponStatuses = allCoupons.map((coupon) => {
      const reason = inapplicableReasonOf(coupon, ctx);
      return { id: coupon.id, applicable: reason === null, reason };
    });

    const result = calculateOrder({
      items,
      candidateCoupons,
      isRemoteArea,
      now,
    });

    return { ...result, couponStatuses };
  },
});

export type OrderService = ReturnType<typeof createOrderService>;
