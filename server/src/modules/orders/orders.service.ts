import { AppError } from '../../errors/AppError.js';
import { ModelError } from '../../errors/ModelError.js';
import type {
  OrderRepository,
  CouponRepository,
  ProductRepository,
} from '../../interfaces/repository.interface.js';
import { orderRepository } from './orders.repository.js';
import { couponRepository } from '../coupons/coupons.repository.js';
import { productRepository } from '../products/product.repository.js';
import { priceCalculator } from '../../utils/priceCalculator.js';
import { Product } from '../products/product.model.js';
import { Order } from './orders.model.js';
import type {
  CouponPolicy,
  OrderContext,
} from '../../interfaces/couponPolicy.interface.js';

export type AddOrderRequest = {
  products: {
    productId: string;
    quantity: number;
  }[];
};

export const createOrderService = ({
  orderRepository,
  couponRepository,
  productRepository,
  getNow = () => new Date(),
}: {
  orderRepository: OrderRepository;
  couponRepository: CouponRepository;
  productRepository: ProductRepository;
  getNow?: () => Date;
}) => ({
  addOrder(params: AddOrderRequest) {
    const { products } = params;

    const productIds = products.map((product) => product.productId);
    findProductsOrThrow(productIds, productRepository);

    try {
      const order = new Order({
        orderId: crypto.randomUUID(),
        products,
        couponIds: [],
      });

      const orderContext = createOrderContext(
        order,
        productRepository,
        getNow(),
      );
      const bestDiscount = priceCalculator.calculateBestCouponDiscount(
        orderContext,
        couponRepository.findAll(),
      );

      order.changeCoupons(bestDiscount.couponIds);
      orderRepository.save(order);

      return { orderId: order.orderId };
    } catch (error) {
      if (error instanceof ModelError) {
        throw new AppError(400, error.code, error.message);
      }
      throw error;
    }
  },
  getOrder(orderId: string) {
    const order = findOrderOrThrow(orderId, orderRepository);

    return createOrderResponse(
      order,
      productRepository,
      couponRepository,
      getNow(),
    );
  },
  applyCoupons(orderId: string, couponIds: string[]) {
    const order = findOrderOrThrow(orderId, orderRepository);
    validateCouponIds(order, couponIds);

    const coupons = findCouponsOrThrow(couponIds, couponRepository);
    const orderContext = createOrderContext(
      order,
      productRepository,
      getNow(),
    );

    validateApplicableCoupons(coupons, orderContext);

    // 쿠폰 업데이트
    order.changeCoupons(couponIds);
    orderRepository.save(order);

    // 새로 계산된 priceInfo 반환
    return createOrderResponse(
      order,
      productRepository,
      couponRepository,
      getNow(),
    );
  },
  previewCouponDiscount(orderId: string, couponIds: string[]) {
    const order = findOrderOrThrow(orderId, orderRepository);
    validateCouponIds(order, couponIds);

    const coupons = findCouponsOrThrow(couponIds, couponRepository);
    const orderContext = createOrderContext(
      order,
      productRepository,
      getNow(),
    );

    validateApplicableCoupons(coupons, orderContext);

    const discount = priceCalculator.calculateSelectedCouponDiscount(
      orderContext,
      coupons,
    );

    return {
      ...discount,
      totalDiscountPrice:
        discount.productDiscountPrice + discount.deliveryDiscountPrice,
    };
  },
  changeDeliveryArea(orderId: string, isIsland: boolean) {
    // 배송지 업데이트
    const order = findOrderOrThrow(orderId, orderRepository);

    order.changeDeliveryArea(isIsland);
    orderRepository.save(order);

    // 새로 계산된 priceInfo 반환
    return createOrderResponse(
      order,
      productRepository,
      couponRepository,
      getNow(),
    );
  },
});

const findOrderOrThrow = (
  orderId: string,
  orderRepository: OrderRepository,
) => {
  const order = orderRepository.findById(orderId);

  if (!order) {
    throw new AppError(404, 'ORDER_NOT_FOUND', '존재하지 않는 주문입니다.');
  }

  return order;
};
const findProductsOrThrow = (
  productIds: string[],
  productRepository: ProductRepository,
) => {
  return productIds.map((productId) => {
    const product = productRepository.findById(productId);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    return product;
  });
};
const findCouponsOrThrow = (
  couponIds: string[],
  couponRepository: CouponRepository,
) => {
  const coupons = couponRepository.findByIds(couponIds);

  if (!coupons) {
    throw new AppError(404, 'COUPON_NOT_FOUND', '존재하지 않는 쿠폰입니다.');
  }

  return coupons;
};

const createOrderContext = (
  order: Order,
  productRepository: ProductRepository,
  now: Date,
): OrderContext => {
  const productIds = order.products.map((product) => product.productId);
  const products = findProductsOrThrow(productIds, productRepository);
  const orderProducts = createOrderProductsResponse(order, products);

  return {
    orderProducts,
    isIsland: order.isIsland,
    now,
  };
};

const validateCouponIds = (order: Order, couponIds: string[]) => {
  if (
    !Array.isArray(couponIds) ||
    couponIds.some(
      (couponId) => typeof couponId !== 'string' || couponId.trim() === '',
    )
  ) {
    throw new AppError(
      400,
      'INVALID_COUPON_IDS',
      '유효하지 않은 쿠폰 목록입니다.',
    );
  }

  try {
    order.validateCouponCount(couponIds);
  } catch (error) {
    if (error instanceof ModelError) {
      throw new AppError(400, error.code, error.message);
    }

    throw error;
  }
};

const validateApplicableCoupons = (
  coupons: CouponPolicy[],
  orderContext: OrderContext,
) => {
  const couponContext = priceCalculator.createCouponContext(orderContext);
  const hasInvalidCoupon = coupons.some(
    (coupon) => !coupon.isApplicable(couponContext),
  );

  if (hasInvalidCoupon) {
    throw new AppError(400, 'INVALID_COUPON', '적용할 수 없는 쿠폰입니다.');
  }
};

const createOrderResponse = (
  order: Order,
  productRepository: ProductRepository,
  couponRepository: CouponRepository,
  now: Date,
) => {
  const coupons = findCouponsOrThrow(order.couponIds, couponRepository);
  const orderContext = createOrderContext(order, productRepository, now);
  const { orderProducts } = orderContext;

  // priceInfo 계산
  const orderPrice = priceCalculator.calculateOrderPrice(orderContext);
  const deliveryFee = priceCalculator.calculateDeliveryFee(orderContext);
  const discount = priceCalculator.calculateSelectedCouponDiscount(
    orderContext,
    coupons,
  );

  return {
    orderId: order.orderId,
    products: orderProducts,
    isIsland: order.isIsland,
    couponIds: order.couponIds,
    priceInfo: {
      orderPrice,
      productDiscountPrice: discount.productDiscountPrice,
      deliveryDiscountPrice: discount.deliveryDiscountPrice,
      deliveryFee,
      totalPrice:
        orderPrice -
        discount.productDiscountPrice -
        discount.deliveryDiscountPrice +
        deliveryFee,
    },
  };
};
const createOrderProductsResponse = (order: Order, products: Product[]) => {
  const productMap = new Map(
    products.map((product) => [product.productId, product]),
  );

  return order.products.map((orderProduct) => {
    const product = productMap.get(orderProduct.productId);

    if (!product) {
      throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
    }

    return {
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      imageUrl: product.imageUrl,
      quantity: orderProduct.quantity,
    };
  });
};

export const orderService = createOrderService({
  orderRepository,
  couponRepository,
  productRepository,
});
