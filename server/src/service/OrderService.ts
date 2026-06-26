import {
  generateOrderReceipt,
  validateCoupon,
  CalculatedPrice,
  PreorderItem,
} from "@cart/shared";
import {
  InvalidError,
  ConflictError,
  NotFoundError,
} from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { CouponRepositoryInterface } from "../repositories/interfaces/CouponRepositoryInterface";
import { OrderRepositoryInterface } from "../repositories/interfaces/OrderRepositoryInterface";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";
import { Order } from "../repositories/Order";
import { validateId } from "../util/Validator";
import { PreorderRepositoryInterface } from "../repositories/interfaces/PreorderRepositoryInterface";

export interface OrderRequestPayload {
  preorderId: string;
  couponIds: number[];
  isRemoteArea: boolean;
  expectedPriceSummary: CalculatedPrice;
}

export default class OrderService {
  #productRepo: ProductRepositoryInterface;
  #couponRepo: CouponRepositoryInterface;
  #orderRepo: OrderRepositoryInterface;
  #cartRepo: CartRepositoryInterface;
  #preorderRepo: PreorderRepositoryInterface;

  constructor(
    productRepo: ProductRepositoryInterface,
    couponRepo: CouponRepositoryInterface,
    orderRepo: OrderRepositoryInterface,
    cartRepo: CartRepositoryInterface,
    preorderRepo: PreorderRepositoryInterface,
  ) {
    this.#productRepo = productRepo;
    this.#couponRepo = couponRepo;
    this.#orderRepo = orderRepo;
    this.#cartRepo = cartRepo;
    this.#preorderRepo = preorderRepo;
  }

  createOrder(payload: OrderRequestPayload): Order {
    const serverTime = new Date();

    const preorder = this.#preorderRepo.findById(payload.preorderId);
    if (!preorder) {
      throw new NotFoundError("만료되었거나 존재하지 않는 주문 세션입니다.");
    }

    if (!payload.expectedPriceSummary) {
      throw new InvalidError(ERROR_MESSAGE.NO_EXPECTED_PRICE);
    }

    const serverItems: PreorderItem[] = preorder.items.map((item) => {
      const product = this.#productRepo.findById(item.productId);
      if (!product) throw new ConflictError(ERROR_MESSAGE.NO_MATCH_PRODUCT);
      if (product.totalQuantity < item.quantity) {
        throw new InvalidError(ERROR_MESSAGE.NO_STOCK);
      }

      return {
        productId: product.productId,
        name: product.name,
        price: product.price,
        thumbnailUrl: product.thumbnailUrl,
        quantity: item.quantity,
      };
    });

    const serverCoupons = payload.couponIds.map((id) => {
      const coupon = this.#couponRepo.findById(id);
      if (!coupon) throw new ConflictError(ERROR_MESSAGE.NOT_FOUND_COUPON);
      return coupon;
    });

    const hasInvalidCoupon = serverCoupons.some(
      (coupon) => !validateCoupon(serverItems, coupon, serverTime),
    );
    if (hasInvalidCoupon) {
      throw new InvalidError(ERROR_MESSAGE.INVALID_COUPON_CONDITION);
    }

    const serverReceipt = generateOrderReceipt(
      serverItems,
      serverCoupons,
      payload.isRemoteArea,
      serverTime,
    );

    this.#verifyExpectedPrice(
      payload.expectedPriceSummary,
      serverReceipt.priceSummary,
    );

    const savedOrder = this.#orderRepo.save({
      items: serverItems,
      priceSummary: serverReceipt.priceSummary,
      giftItems: serverReceipt.giftItems,
    });

    serverItems.forEach((item) => {
      this.#cartRepo.deleteByProductId(item.productId);
    });

    // 재고 차감용 임시 데이터
    const quantityChangeMap = new Map<number, number>();

    serverItems.forEach((item) => {
      const currentQty = quantityChangeMap.get(item.productId) || 0;
      quantityChangeMap.set(item.productId, currentQty + item.quantity);
    });

    if (serverReceipt.giftItems && serverReceipt.giftItems.length > 0) {
      serverReceipt.giftItems.forEach((gift) => {
        const currentQty = quantityChangeMap.get(gift.productId) || 0;
        quantityChangeMap.set(gift.productId, currentQty + gift.giftQuantity);
      });
    }

    // DB에서 주문+증정 수량 차감
    quantityChangeMap.forEach((changeQuantity, productId) => {
      this.#productRepo.decreaseQuantity(productId, changeQuantity);
    });

    return savedOrder;
  }

  #verifyExpectedPrice(
    expected: CalculatedPrice,
    actual: CalculatedPrice,
  ): void {
    if (expected.totalPaymentAmount !== actual.totalPaymentAmount) {
      throw new ConflictError(ERROR_MESSAGE.PRICE_MISMATCH_CONFLICT);
    }

    if (
      expected.discountAmount !== actual.discountAmount ||
      expected.shippingFee !== actual.shippingFee
    ) {
      throw new ConflictError(ERROR_MESSAGE.DETAIL_AMOUNT_CONFLICT);
    }
  }

  getOrder(orderId: number): Order {
    validateId(orderId);

    const order = this.#orderRepo.findById(orderId);
    if (!order) {
      throw new NotFoundError(ERROR_MESSAGE.NO_ORDER);
    }

    return order;
  }
}
