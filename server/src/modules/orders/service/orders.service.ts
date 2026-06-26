import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
import {
  CouponsService,
  DiscountContext,
} from "@/modules/coupons/service/coupons.service";
import { ProductsService } from "@/modules/products/service/products.service";
import { OrderRepository } from "../repository/orders.repository";
import { OrderProduct } from "../types";

export class OrdersService {
  private MAX_COUPON_COUNT = 2;

  constructor(
    private ordersRepository: OrderRepository,
    private couponsService: CouponsService,
    private productsService: ProductsService,
  ) {}

  getOrder() {
    const order = this.ordersRepository.getOrders()[0];
    if (!order) {
      throw createAppError(ERROR_CODES.NOT_EXIST_ORDER);
    }

    const enrichedProducts = order.orderProducts.map(
      ({ productId, quantity }) => {
        const product = this.productsService.getProductById(productId);
        return {
          productId,
          productName: product.name,
          productPrice: product.price,
          imgUrl: product.image,
          quantity,
        };
      },
    );

    const priceInfo = this.calculatePriceInfo(
      order.orderProducts,
      order.couponIds,
      order.isIsland,
    );

    return {
      orderId: order.orderId,
      orderProducts: enrichedProducts,
      isIsland: order.isIsland,
      couponIds: order.couponIds,
      priceInfo: {
        orderPrice: priceInfo.orderPrice,
        discountPrice: priceInfo.discountPrice,
        deliveryFee: priceInfo.deliveryFee,
        totalPrice: priceInfo.totalPrice,
      },
    };
  }

  createInitialOrder(orderProducts: OrderProduct[]) {
    const isIsland = false;

    const orderPrice = this.calculateOrderPrice(orderProducts);
    const products = this.buildDiscountProducts(orderProducts);
    const deliveryFee = this.calculateShippingFee(orderPrice, isIsland);

    const bestCoupons = this.couponsService
      .getBestCoupons(
        { deliveryFee, orderPrice, products },
        this.MAX_COUPON_COUNT,
      )
      .map(({ couponId }) => couponId);

    const createdOrder = this.ordersRepository.createOrder({
      orderProducts,
      couponIds: bestCoupons,
      isIsland,
    });

    return createdOrder.orderId;
  }

  updateOrderCoupons(couponIds: string[]) {
    if (couponIds.length > this.MAX_COUPON_COUNT) {
      throw createAppError(ERROR_CODES.EXCEED_MAX_COUPON_COUNT);
    }

    this.validateCouponIds(couponIds);

    const order = this.ordersRepository.getOrders()[0];
    this.ordersRepository.updateOrder(order.orderId, {
      ...order,
      couponIds,
    });

    const priceInfo = this.calculatePriceInfo(
      order.orderProducts,
      couponIds,
      order.isIsland,
    );

    return {
      priceInfo: {
        orderPrice: priceInfo.orderPrice,
        discountPrice: priceInfo.discountPrice,
        deliveryFee: priceInfo.deliveryFee,
        totalPrice: priceInfo.totalPrice,
      },
    };
  }

  updateOrderIsIsland(isIsland: boolean) {
    const order = this.ordersRepository.getOrders()[0];
    this.ordersRepository.updateOrder(order.orderId, {
      ...order,
      isIsland,
    });

    const priceInfo = this.calculatePriceInfo(
      order.orderProducts,
      order.couponIds,
      isIsland,
    );

    return {
      priceInfo: {
        orderPrice: priceInfo.orderPrice,
        discountPrice: priceInfo.discountPrice,
        deliveryFee: priceInfo.deliveryFee,
        totalPrice: priceInfo.totalPrice,
      },
    };
  }

  calculateDiscountPriceByCoupons(couponIds: string[]) {
    this.validateCouponIds(couponIds);

    const context = this.getCurrentDiscountContext();
    if (!context) {
      throw createAppError(ERROR_CODES.NOT_EXIST_ORDER);
    }

    const discountPrice = couponIds.reduce(
      (acc, couponId) =>
        acc + this.couponsService.calculateDiscountPrice(couponId, context),
      0,
    );

    return discountPrice;
  }

  getCurrentDiscountContext(): DiscountContext | null {
    const order = this.ordersRepository.getOrders()[0];
    if (!order) return null;

    const orderPrice = this.calculateOrderPrice(order.orderProducts);
    const products = this.buildDiscountProducts(order.orderProducts);
    const deliveryFee = this.calculateShippingFee(orderPrice, order.isIsland);

    return { orderPrice, deliveryFee, products };
  }

  private validateCouponIds(couponIds: string[]) {
    for (const couponId of couponIds) {
      const coupon = this.couponsService.getCouponById(couponId);
      if (!coupon) {
        throw createAppError(ERROR_CODES.NOT_EXIST_COUPON);
      }
    }
  }

  private calculatePriceInfo(
    orderProducts: OrderProduct[],
    couponIds: string[],
    isIsland: boolean,
  ) {
    const orderPrice = this.calculateOrderPrice(orderProducts);
    const products = this.buildDiscountProducts(orderProducts);
    const deliveryFee = this.calculateShippingFee(orderPrice, isIsland);

    const discountPrice = couponIds.reduce(
      (acc, couponId) =>
        acc +
        this.couponsService.calculateDiscountPrice(couponId, {
          orderPrice,
          deliveryFee,
          products,
        }),
      0,
    );

    const totalPrice = orderPrice - discountPrice + deliveryFee;

    return { orderPrice, deliveryFee, discountPrice, totalPrice };
  }

  private calculateOrderPrice(orderProducts: OrderProduct[]): number {
    return orderProducts.reduce((acc, { productId, quantity }) => {
      const product = this.productsService.getProductById(productId);
      return acc + product.price * quantity;
    }, 0);
  }

  private buildDiscountProducts(
    orderProducts: OrderProduct[],
  ): DiscountContext["products"] {
    return orderProducts.map(({ productId, quantity }) => {
      const product = this.productsService.getProductById(productId);
      return { productId, price: product.price, quantity };
    });
  }

  private calculateShippingFee(orderAmount: number, isIsland: boolean): number {
    const DELIVERY_FEE = 3000;
    const IS_ISLAND_DELIVERY_FEE = 3000;
    const FREE_DELIVERY_THRESHOLD = 100000;

    if (orderAmount >= FREE_DELIVERY_THRESHOLD) return 0;
    if (isIsland) return DELIVERY_FEE + IS_ISLAND_DELIVERY_FEE;
    return DELIVERY_FEE;
  }
}
