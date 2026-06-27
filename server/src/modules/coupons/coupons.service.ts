import { AppError } from '../../errors/AppError.js';
import type {
  CouponRepository,
  OrderRepository,
  ProductRepository,
} from '../../interfaces/repository.interface.js';
import { priceCalculator } from '../../utils/priceCalculator.js';
import { orderRepository } from '../orders/orders.repository.js';
import type { Order } from '../orders/orders.model.js';
import { productRepository } from '../products/product.repository.js';
import type { Product } from '../products/product.model.js';
import { couponRepository } from './coupons.repository.js';

type CouponResponse = {
  couponId: string;
  couponName: string;
  couponDescription: string;
  isDisabled: boolean;
  couponExpiration: Date;
};

type GetCouponResponse = {
  couponList: CouponResponse[];
};

export const createCouponService = ({
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
  getCoupons(orderId: string): GetCouponResponse {
    const order = findOrderOrThrow(orderId, orderRepository);
    const orderProducts = createOrderProducts(order, productRepository);
    const context = priceCalculator.createCouponContext({
      orderProducts,
      isIsland: order.isIsland,
      now: getNow(),
    });

    const coupons = couponRepository.findAll();

    return {
      couponList: coupons.map((coupon) => ({
        couponId: coupon.couponId,
        couponName: coupon.couponName,
        couponDescription: coupon.couponDescription,
        isDisabled: !coupon.isApplicable(context),
        couponExpiration: coupon.expiresAt,
      })),
    };
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

const createOrderProducts = (
  order: Order,
  productRepository: ProductRepository,
) => {
  return order.products.map((orderProduct) => {
    const product = findProductOrThrow(
      orderProduct.productId,
      productRepository,
    );

    return {
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      quantity: orderProduct.quantity,
    };
  });
};

const findProductOrThrow = (
  productId: string,
  productRepository: ProductRepository,
): Product => {
  const product = productRepository.findById(productId);

  if (!product) {
    throw new AppError(404, 'PRODUCT_NOT_FOUND', '존재하지 않는 상품입니다.');
  }

  return product;
};

export const couponService = createCouponService({
  orderRepository,
  couponRepository,
  productRepository,
});
