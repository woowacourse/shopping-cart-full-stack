import CartService from "../modules/cart/cart.service.js";
import ProductService from "../modules/product/product.service.js";
import { InMemoryCartRepository } from "../modules/cart/cart.repository.js";
import { InMemoryProductRepository } from "../modules/product/product.repository.js";
import {
  CheckoutRepository,
  InMemoryCheckoutRepository,
} from "../modules/checkout/checkout.repository.js";
import CheckoutService from "../modules/checkout/checkout.service.js";
import { InMemoryCouponRepository } from "../modules/coupon/coupon.repository.js";
import CouponService from "../modules/coupon/coupon.service.js";

const mockProduct = {
  name: "아디다스 양말",
  price: 13000,
  imgUrl: "https://image-url.com",
  quantity: 10,
};

const expectAppErrorCode = (callback: () => unknown, code: string) => {
  let thrownError: unknown;

  try {
    callback();
  } catch (error) {
    thrownError = error;
  }

  if (thrownError === undefined) {
    throw new Error(`${code} 에러가 발생해야 합니다.`);
  }

  expect(thrownError).toMatchObject({ code });
};

describe("임시 영수증 서비스 테스트", () => {
  let productRepository: InMemoryProductRepository;
  let cartRepository: InMemoryCartRepository;
  let couponRepository: InMemoryCouponRepository;
  let checkoutRepository: CheckoutRepository;

  let productService: ProductService;
  let cartService: CartService;
  let couponService: CouponService;
  let checkoutService: CheckoutService;

  let productId: number;
  let cartId: number;
  let checkoutId: number;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    cartRepository = new InMemoryCartRepository();
    couponRepository = new InMemoryCouponRepository();
    checkoutRepository = new InMemoryCheckoutRepository();

    productService = new ProductService(productRepository, cartRepository);
    cartService = new CartService(cartRepository, productRepository);
    couponService = new CouponService(couponRepository);
    checkoutService = new CheckoutService(
      checkoutRepository,
      cartService,
      couponService,
    );

    // 상품 생성, 해당 상품을 장바구니에 추가, 임시 영수증 생성
    productId = productService.addProduct(mockProduct);
    cartId = cartService.addCart();
    const cartItemCount = 5;
    cartService.addCartItem(cartId, productId, cartItemCount);
    const selectedProductIds = [1];
    checkoutId = checkoutService.createCheckout(cartId, selectedProductIds);
  });

  test("임시 영수증을 생성하면 생성된 영수증 id를 반환한다.", () => {
    // given

    const selectedProductIds = [1];

    // when
    const newCheckoutId = checkoutService.createCheckout(
      cartId,
      selectedProductIds,
    );

    // then
    expect(newCheckoutId).toBe(2);
  });

  test("유효한 영수증의 정보를 반환한다.", () => {
    // when
    const checkoutContent = checkoutService.getCheckoutContent(checkoutId);

    // then
    expect(checkoutContent).toEqual({
      checkoutId: 1,
      checkoutItems: [
        {
          productId: 1,
          name: "아디다스 양말",
          price: 13000,
          imgUrl: "https://image-url.com",
          itemCount: 5,
        },
      ],
      appliedCouponIds: [],
      remoteArea: false,
      orderPrice: 65000,
      couponDiscountPrice: 0,
      deliveryFee: 3000,
      totalPrice: 68000,
    });
  });

  test("유효한 영수증의 도서산간 여부를 변경하고, 변경된 값을 반환한다.", () => {
    // given
    const nextRemoteArea = true;

    // when
    const updatedRemoteArea = checkoutService.updateRemoteArea(
      checkoutId,
      nextRemoteArea,
    );

    // then
    expect(updatedRemoteArea).toBe(true);
  });

  test("선택한 상품만 포함해 임시 영수증을 생성한다.", () => {
    // given
    const anotherProduct = {
      name: "나이키 신발",
      price: 50000,
      imgUrl: "https://another-image-url.com",
      quantity: 10,
    };
    const anotherProductId = productService.addProduct(anotherProduct);
    cartService.addCartItem(cartId, anotherProductId, 2);

    // when
    const selectedCheckoutId = checkoutService.createCheckout(cartId, [
      anotherProductId,
    ]);
    const checkoutContent =
      checkoutService.getCheckoutContent(selectedCheckoutId);

    // then
    expect(checkoutContent.checkoutItems).toEqual([
      {
        productId: anotherProductId,
        name: "나이키 신발",
        price: 50000,
        imgUrl: "https://another-image-url.com",
        itemCount: 2,
      },
    ]);
    expect(checkoutContent.orderPrice).toBe(100000);
    expect(checkoutContent.totalPrice).toBe(103000);
  });

  test("장바구니에 없는 상품으로 임시 영수증을 생성하면 PRODUCT_NOT_EXIST_IN_CART 에러가 발생한다.", () => {
    // given
    const notInCartProductId = productService.addProduct({
      name: "나이키 양말",
      price: 15000,
      imgUrl: "https://not-in-cart-image-url.com",
      quantity: 10,
    });

    // when & then
    expectAppErrorCode(
      () => checkoutService.createCheckout(cartId, [notInCartProductId]),
      "PRODUCT_NOT_EXIST_IN_CART",
    );
  });

  test("존재하지 않는 임시 영수증을 조회하면 CHECKOUT_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCheckoutId = 999999999;

    // when & then
    expectAppErrorCode(
      () => checkoutService.getCheckoutContent(notFoundCheckoutId),
      "CHECKOUT_NOT_FOUND",
    );
  });

  test("존재하지 않는 임시 영수증의 도서산간 여부를 변경하면 CHECKOUT_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCheckoutId = 999999999;

    // when & then
    expectAppErrorCode(
      () => checkoutService.updateRemoteArea(notFoundCheckoutId, true),
      "CHECKOUT_NOT_FOUND",
    );
  });

  test("도서산간 여부를 변경하면 배송비와 총 결제 금액을 다시 계산한다.", () => {
    // when
    checkoutService.updateRemoteArea(checkoutId, true);
    const remoteAreaContent = checkoutService.getCheckoutContent(checkoutId);

    checkoutService.updateRemoteArea(checkoutId, false);
    const defaultAreaContent = checkoutService.getCheckoutContent(checkoutId);

    // then
    expect(remoteAreaContent).toEqual(
      expect.objectContaining({
        remoteArea: true,
        deliveryFee: 6000,
        totalPrice: 71000,
      }),
    );
    expect(defaultAreaContent).toEqual(
      expect.objectContaining({
        remoteArea: false,
        deliveryFee: 3000,
        totalPrice: 68000,
      }),
    );
  });

  test("임시 영수증 기준으로 쿠폰 목록과 추천 쿠폰 id를 반환한다.", () => {
    // given
    couponService.createBaseCoupon();
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when
    const checkoutCoupons = checkoutService.getCheckoutCoupons(
      checkoutId,
      requestedAt,
    );

    // then
    expect(checkoutCoupons.coupons).toHaveLength(4);
    expect(checkoutCoupons.recommendedCouponIds).toEqual([2, 4]);
  });

  test("존재하지 않는 임시 영수증의 쿠폰 목록을 조회하면 CHECKOUT_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCheckoutId = 999999999;
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when & then
    expectAppErrorCode(
      () => checkoutService.getCheckoutCoupons(notFoundCheckoutId, requestedAt),
      "CHECKOUT_NOT_FOUND",
    );
  });

  test("유효한 쿠폰을 적용하면 임시 영수증에 적용된 쿠폰 id를 저장하고 금액을 다시 계산한다.", () => {
    // given
    const couponId = couponService.createCoupon({
      baseInformation: {
        name: "5,000원 할인 쿠폰",
        type: "FIXED5000",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: 5000,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 0,
        startTime: null,
        endTime: null,
      },
    });
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when
    const appliedCouponIds = checkoutService.applyCoupon(
      checkoutId,
      [couponId],
      requestedAt,
    );
    const checkoutContent = checkoutService.getCheckoutContent(checkoutId);

    // then
    expect(appliedCouponIds).toEqual([couponId]);
    expect(checkoutContent).toEqual(
      expect.objectContaining({
        appliedCouponIds: [couponId],
        couponDiscountPrice: 5000,
        totalPrice: 63000,
      }),
    );
  });

  test("도서산간 배송비에 무료 배송 쿠폰을 적용하면 도서산간 배송비까지 할인한다.", () => {
    // given
    const freeShippingCouponId = couponService.createCoupon({
      baseInformation: {
        name: "무료 배송 쿠폰",
        type: "FREESHIPPING",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 0,
        startTime: null,
        endTime: null,
      },
    });
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when
    checkoutService.updateRemoteArea(checkoutId, true);
    checkoutService.applyCoupon(
      checkoutId,
      [freeShippingCouponId],
      requestedAt,
    );
    const checkoutContent = checkoutService.getCheckoutContent(checkoutId);

    // then
    expect(checkoutContent).toEqual(
      expect.objectContaining({
        deliveryFee: 6000,
        couponDiscountPrice: 6000,
        totalPrice: 65000,
      }),
    );
  });

  test("존재하지 않는 임시 영수증에 쿠폰을 적용하면 CHECKOUT_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCheckoutId = 999999999;
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when & then
    expectAppErrorCode(
      () => checkoutService.applyCoupon(notFoundCheckoutId, [], requestedAt),
      "CHECKOUT_NOT_FOUND",
    );
  });

  test("존재하지 않는 쿠폰을 적용하면 COUPON_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCouponId = 999999999;
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when & then
    expectAppErrorCode(
      () =>
        checkoutService.applyCoupon(
          checkoutId,
          [notFoundCouponId],
          requestedAt,
        ),
      "COUPON_NOT_FOUND",
    );
  });

  test("사용 불가능한 쿠폰을 적용하면 UNAVIALABLE_COUPON_EXIST 에러가 발생한다.", () => {
    // given
    const unavailableCouponId = couponService.createCoupon({
      baseInformation: {
        name: "10만원 이상 5,000원 할인 쿠폰",
        type: "FIXED5000",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: 5000,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 100000,
        startTime: null,
        endTime: null,
      },
    });
    const requestedAt = new Date("2026-06-18T05:00:00");

    // when & then
    expectAppErrorCode(
      () =>
        checkoutService.applyCoupon(
          checkoutId,
          [unavailableCouponId],
          requestedAt,
        ),
      "UNAVIALABLE_COUPON_EXIST",
    );
  });

  test("쿠폰을 3개 이상 적용하면 COUPON_APPLY_COUNT_EXCEEDED 에러가 발생한다.", () => {
    // given
    const requestedAt = new Date("2026-06-18T05:00:00");
    const couponIds = [1000, 2000, 3000].map((discountPrice) =>
      couponService.createCoupon({
        baseInformation: {
          name: `${discountPrice}원 할인 쿠폰`,
          type: `FIXED${discountPrice}`,
          expiryDate: new Date("2026-06-30T23:59:59"),
        },
        discountPolicy: {
          fixedDiscountPrice: discountPrice,
          fixedDiscountRate: null,
        },
        condition: {
          minAmount: 0,
          startTime: null,
          endTime: null,
        },
      }),
    ) as unknown as [number?, number?];

    // when & then
    expectAppErrorCode(
      () => checkoutService.applyCoupon(checkoutId, couponIds, requestedAt),
      "COUPON_APPLY_COUNT_EXCEEDED",
    );
  });

  test("결제 시 적용된 쿠폰이 유효하면 예외가 발생하지 않는다.", () => {
    // given
    const couponId = couponService.createCoupon({
      baseInformation: {
        name: "5,000원 할인 쿠폰",
        type: "FIXED5000",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: 5000,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 0,
        startTime: null,
        endTime: null,
      },
    });
    const requestedAt = new Date("2026-06-18T05:00:00");
    checkoutService.applyCoupon(checkoutId, [couponId], requestedAt);

    // when & then
    expect(() =>
      checkoutService.validateCoupons(checkoutId, [couponId], requestedAt),
    ).not.toThrow();
  });

  test("결제 시 적용된 쿠폰이 더 이상 유효하지 않으면 UNAVIALABLE_COUPON_EXIST 에러가 발생한다.", () => {
    // given
    const couponId = couponService.createCoupon({
      baseInformation: {
        name: "곧 만료되는 쿠폰",
        type: "FIXED5000",
        expiryDate: new Date("2026-06-18T06:00:00"),
      },
      discountPolicy: {
        fixedDiscountPrice: 5000,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 0,
        startTime: null,
        endTime: null,
      },
    });
    checkoutService.applyCoupon(
      checkoutId,
      [couponId],
      new Date("2026-06-18T05:00:00"),
    );

    // when & then
    expectAppErrorCode(
      () =>
        checkoutService.validateCoupons(
          checkoutId,
          [couponId],
          new Date("2026-06-18T07:00:00"),
        ),
      "UNAVIALABLE_COUPON_EXIST",
    );
  });
});
