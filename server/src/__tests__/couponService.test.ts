import { InMemoryCartRepository } from "../modules/cart/cart.repository.js";
import CartService from "../modules/cart/cart.service.js";
import type { CheckoutItem } from "../modules/checkout/Checkout.js";
import { InMemoryCheckoutRepository } from "../modules/checkout/checkout.repository.js";
import CheckoutService from "../modules/checkout/checkout.service.js";
import { InMemoryCouponRepository } from "../modules/coupon/coupon.repository.js";
import CouponService from "../modules/coupon/coupon.service.js";
import { InMemoryProductRepository } from "../modules/product/product.repository.js";
import ProductService from "../modules/product/product.service.js";

const mockProduct = {
  name: "아디다스 양말",
  price: 13000,
  imgUrl: "https://image-url.com",
  quantity: 10,
};

const mockCouponData = {
  baseInformation: {
    name: "5,000원 할인 쿠폰",
    type: "FIXED5000",
    expiryDate: new Date("2026-06-10"),
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
};

const createCheckoutItem = (
  productId: number,
  price: number,
  itemCount: number,
  name = `상품 ${productId}`,
): CheckoutItem => ({
  productId,
  name,
  price,
  imgUrl: "https://image-url.com",
  itemCount,
});

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

describe("쿠폰 테스트", () => {
  let productRepository: InMemoryProductRepository;
  let cartRepository: InMemoryCartRepository;
  let checkoutRepository: InMemoryCheckoutRepository;
  let couponRepository: InMemoryCouponRepository;

  let productService: ProductService;
  let cartService: CartService;
  let checkoutService: CheckoutService;
  let couponService: CouponService;

  let productId: number;
  let cartId: number;
  let checkoutId: number;
  let couponId: number;

  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    cartRepository = new InMemoryCartRepository();
    checkoutRepository = new InMemoryCheckoutRepository();
    couponRepository = new InMemoryCouponRepository();

    productService = new ProductService(productRepository, cartRepository);
    cartService = new CartService(cartRepository, productRepository);
    couponService = new CouponService(couponRepository);
    checkoutService = new CheckoutService(
      checkoutRepository,
      cartService,
      couponService,
    );

    // 상품 생성, 해당 상품을 장바구니에 추가, 임시 영수증 생성, 쿠폰 생성
    productId = productService.addProduct(mockProduct);
    cartId = cartService.addCart();
    const cartItemCount = 10;
    cartService.addCartItem(cartId, productId, cartItemCount);
    const selectedProductIds = [1];
    checkoutId = checkoutService.createCheckout(cartId, selectedProductIds);
    couponId = couponService.createCoupon(mockCouponData);
  });

  test("쿠폰을 생성하면 생성된 쿠폰 id를 반환한다.", () => {
    // when
    const newCouponId = couponService.createCoupon(mockCouponData);

    // then
    expect(newCouponId).toBe(2);
  });

  test("올바른 쿠폰 목록을 조회한다.", () => {
    // given
    const requestedAt = new Date("2026-06-10");
    const checkoutItems =
      checkoutService.getCheckoutContent(checkoutId).checkoutItems;

    // when
    const coupons = couponService.getCoupons(checkoutItems, requestedAt);

    // then
    expect(coupons).toEqual([
      {
        id: 1,
        name: "5,000원 할인 쿠폰",
        type: "FIXED5000",
        expiryDate: "2026-06-10",
        fixedDiscountPrice: 5000,
        fixedDiscountRate: null,
        minAmount: 100000,
        startTime: null,
        endTime: null,
        isAvailable: true,
      },
    ]);
  });

  test("존재하는 쿠폰 중 할인율이 가장 높은 쿠폰 2개의 id를 반환한다.", () => {
    // given
    const mockCoupons = [
      {
        baseInformation: {
          name: "10,000원 할인 쿠폰",
          type: "FIXED10000",
          expiryDate: new Date("2026-06-10"),
        },
        discountPolicy: {
          fixedDiscountPrice: 10000,
          fixedDiscountRate: null,
        },
        condition: {
          minAmount: 0,
          startTime: null,
          endTime: null,
        },
      },
      {
        baseInformation: {
          name: "20,000원 할인 쿠폰",
          type: "FIXED20000",
          expiryDate: new Date("2026-06-10"),
        },
        discountPolicy: {
          fixedDiscountPrice: 20000,
          fixedDiscountRate: null,
        },
        condition: {
          minAmount: 100000,
          startTime: null,
          endTime: null,
        },
      },
    ];
    mockCoupons.forEach((couponData) => couponService.createCoupon(couponData));
    const requestedAt = new Date("2026-06-10");
    const { checkoutItems, deliveryFee, orderPrice } =
      checkoutService.getCheckoutContent(checkoutId);

    // when
    const recommendedCouponIds = couponService.getRecommendedCouponIds(
      orderPrice,
      checkoutItems,
      deliveryFee,
      requestedAt,
    );

    // then
    expect(recommendedCouponIds).toEqual([3, 2]);
  });

  test("최소 주문 금액 미만이면 정액 쿠폰은 사용 불가능하다.", () => {
    // given
    const requestedAt = new Date("2026-06-10");
    const checkoutItems = [createCheckoutItem(1, 99999, 1)];

    // when
    const coupons = couponService.getCoupons(checkoutItems, requestedAt);

    // then
    expect(coupons[0]).toEqual(
      expect.objectContaining({
        id: couponId,
        isAvailable: false,
      }),
    );
  });

  test("최소 주문 금액 이상이면 정액 쿠폰은 사용 가능하다.", () => {
    // given
    const requestedAt = new Date("2026-06-10");
    const checkoutItems = [createCheckoutItem(1, 50000, 2)];

    // when
    const coupons = couponService.getCoupons(checkoutItems, requestedAt);

    // then
    expect(coupons[0]).toEqual(
      expect.objectContaining({
        id: couponId,
        isAvailable: true,
      }),
    );
  });

  test("만료일이 지난 쿠폰은 사용 불가능하다.", () => {
    // given
    const requestedAt = new Date("2026-06-11T00:00:00");
    const checkoutItems = [createCheckoutItem(1, 50000, 2)];

    // when
    const coupons = couponService.getCoupons(checkoutItems, requestedAt);

    // then
    expect(coupons[0]).toEqual(
      expect.objectContaining({
        id: couponId,
        isAvailable: false,
      }),
    );
  });

  test("2+1 쿠폰은 동일 상품을 3개 이상 담은 상품 중 가장 비싼 단가만큼 할인한다.", () => {
    // given
    const bogoCouponId = couponService.createCoupon({
      baseInformation: {
        name: "2+1 쿠폰",
        type: "BOGO",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: null,
        startTime: null,
        endTime: null,
      },
    });
    const checkoutItems = [
      createCheckoutItem(1, 30000, 2),
      createCheckoutItem(2, 20000, 3),
      createCheckoutItem(3, 15000, 4),
    ];

    // when
    const discountPrice = couponService.getDiscountPrice(
      bogoCouponId,
      120000,
      checkoutItems,
      3000,
    );

    // then
    expect(discountPrice).toBe(20000);
  });

  test("2+1 쿠폰 조건에 맞는 상품이 없으면 할인 금액은 0원이다.", () => {
    // given
    const bogoCouponId = couponService.createCoupon({
      baseInformation: {
        name: "2+1 쿠폰",
        type: "BOGO",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: null,
        startTime: null,
        endTime: null,
      },
    });
    const checkoutItems = [
      createCheckoutItem(1, 30000, 2),
      createCheckoutItem(2, 20000, 1),
    ];

    // when
    const discountPrice = couponService.getDiscountPrice(
      bogoCouponId,
      80000,
      checkoutItems,
      3000,
    );

    // then
    expect(discountPrice).toBe(0);
  });

  test("무료 배송 쿠폰은 최소 주문 금액 이상이면 배송비 전액을 할인한다.", () => {
    // given
    const freeShippingCouponId = couponService.createCoupon({
      baseInformation: {
        name: "무료 배송 쿠폰",
        type: "FREESHIPPING",
        expiryDate: new Date("2026-08-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 50000,
        startTime: null,
        endTime: null,
      },
    });
    const checkoutItems = [createCheckoutItem(1, 25000, 2)];

    // when
    const coupons = couponService.getCoupons(
      checkoutItems,
      new Date("2026-06-10"),
    );
    const discountPrice = couponService.getDiscountPrice(
      freeShippingCouponId,
      50000,
      checkoutItems,
      6000,
    );

    // then
    expect(coupons.find((coupon) => coupon.id === freeShippingCouponId)).toEqual(
      expect.objectContaining({ isAvailable: true }),
    );
    expect(discountPrice).toBe(6000);
  });

  test("무료 배송 쿠폰은 최소 주문 금액 미만이면 사용 불가능하다.", () => {
    // given
    const freeShippingCouponId = couponService.createCoupon({
      baseInformation: {
        name: "무료 배송 쿠폰",
        type: "FREESHIPPING",
        expiryDate: new Date("2026-08-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 50000,
        startTime: null,
        endTime: null,
      },
    });
    const checkoutItems = [createCheckoutItem(1, 49999, 1)];

    // when
    const coupons = couponService.getCoupons(
      checkoutItems,
      new Date("2026-06-10"),
    );

    // then
    expect(coupons.find((coupon) => coupon.id === freeShippingCouponId)).toEqual(
      expect.objectContaining({ isAvailable: false }),
    );
  });

  test("시간제 할인 쿠폰은 오전 4시부터 오전 7시 전까지만 사용 가능하다.", () => {
    // given
    const miracleSaleCouponId = couponService.createCoupon({
      baseInformation: {
        name: "30% 시간제 할인 쿠폰",
        type: "MIRACLESALE",
        expiryDate: new Date("2026-07-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: 30,
      },
      condition: {
        minAmount: null,
        startTime: "04:00",
        endTime: "07:00",
      },
    });
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];
    const findMiracleSaleCoupon = (requestedAt: Date) =>
      couponService
        .getCoupons(checkoutItems, requestedAt)
        .find((coupon) => coupon.id === miracleSaleCouponId);

    // when & then
    expect(
      findMiracleSaleCoupon(new Date("2026-06-10T03:59:00")),
    ).toEqual(expect.objectContaining({ isAvailable: false }));
    expect(
      findMiracleSaleCoupon(new Date("2026-06-10T04:00:00")),
    ).toEqual(expect.objectContaining({ isAvailable: true }));
    expect(
      findMiracleSaleCoupon(new Date("2026-06-10T06:59:00")),
    ).toEqual(expect.objectContaining({ isAvailable: true }));
    expect(
      findMiracleSaleCoupon(new Date("2026-06-10T07:00:00")),
    ).toEqual(expect.objectContaining({ isAvailable: false }));
  });

  test("시간제 할인 쿠폰은 주문 금액의 정해진 비율만큼 할인한다.", () => {
    // given
    const miracleSaleCouponId = couponService.createCoupon({
      baseInformation: {
        name: "30% 시간제 할인 쿠폰",
        type: "MIRACLESALE",
        expiryDate: new Date("2026-07-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: 30,
      },
      condition: {
        minAmount: null,
        startTime: "04:00",
        endTime: "07:00",
      },
    });
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];

    // when
    const discountPrice = couponService.getDiscountPrice(
      miracleSaleCouponId,
      100000,
      checkoutItems,
      3000,
    );

    // then
    expect(discountPrice).toBe(30000);
  });

  test("정액 쿠폰을 먼저 적용한 뒤 남은 금액 기준으로 정률 쿠폰을 적용한다.", () => {
    // given
    const fixedCouponId = couponService.createCoupon({
      baseInformation: {
        name: "10,000원 할인 쿠폰",
        type: "FIXED10000",
        expiryDate: new Date("2026-07-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: 10000,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 0,
        startTime: null,
        endTime: null,
      },
    });
    const miracleSaleCouponId = couponService.createCoupon({
      baseInformation: {
        name: "30% 시간제 할인 쿠폰",
        type: "MIRACLESALE",
        expiryDate: new Date("2026-07-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: 30,
      },
      condition: {
        minAmount: null,
        startTime: "04:00",
        endTime: "07:00",
      },
    });
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];

    // when
    const totalDiscountPrice = couponService.getTotalDiscountPrice(
      [miracleSaleCouponId, fixedCouponId],
      100000,
      checkoutItems,
      3000,
    );

    // then
    expect(totalDiscountPrice).toBe(37000);
  });

  test("적용한 쿠폰이 없으면 총 할인 금액은 0원이다.", () => {
    // given
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];

    // when
    const totalDiscountPrice = couponService.getTotalDiscountPrice(
      [],
      100000,
      checkoutItems,
      3000,
    );

    // then
    expect(totalDiscountPrice).toBe(0);
  });

  test("사용 가능한 쿠폰이 없으면 추천 쿠폰 id 목록은 빈 배열이다.", () => {
    // given
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];
    const requestedAt = new Date("2026-06-11T00:00:00");

    // when
    const recommendedCouponIds = couponService.getRecommendedCouponIds(
      100000,
      checkoutItems,
      3000,
      requestedAt,
    );

    // then
    expect(recommendedCouponIds).toEqual([]);
  });

  test("사용 가능한 쿠폰이 1개뿐이면 추천 쿠폰 id를 1개만 반환한다.", () => {
    // given
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];
    const requestedAt = new Date("2026-06-10");

    // when
    const recommendedCouponIds = couponService.getRecommendedCouponIds(
      100000,
      checkoutItems,
      3000,
      requestedAt,
    );

    // then
    expect(recommendedCouponIds).toEqual([couponId]);
  });

  test("여러 타입의 쿠폰 중 총 할인 금액이 가장 큰 쿠폰 2개를 추천한다.", () => {
    // given
    const bogoCouponId = couponService.createCoupon({
      baseInformation: {
        name: "2+1 쿠폰",
        type: "BOGO",
        expiryDate: new Date("2026-06-30T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: null,
        startTime: null,
        endTime: null,
      },
    });
    couponService.createCoupon({
      baseInformation: {
        name: "무료 배송 쿠폰",
        type: "FREESHIPPING",
        expiryDate: new Date("2026-08-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: null,
      },
      condition: {
        minAmount: 50000,
        startTime: null,
        endTime: null,
      },
    });
    const miracleSaleCouponId = couponService.createCoupon({
      baseInformation: {
        name: "30% 시간제 할인 쿠폰",
        type: "MIRACLESALE",
        expiryDate: new Date("2026-07-31T23:59:59"),
      },
      discountPolicy: {
        fixedDiscountPrice: null,
        fixedDiscountRate: 30,
      },
      condition: {
        minAmount: null,
        startTime: "04:00",
        endTime: "07:00",
      },
    });
    const checkoutItems = [createCheckoutItem(1, 13000, 5)];
    const requestedAt = new Date("2026-06-10T05:00:00");

    // when
    const recommendedCouponIds = couponService.getRecommendedCouponIds(
      65000,
      checkoutItems,
      3000,
      requestedAt,
    );

    // then
    expect(recommendedCouponIds).toEqual([bogoCouponId, miracleSaleCouponId]);
  });

  test("존재하지 않는 쿠폰의 할인 금액을 조회하면 COUPON_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCouponId = 999999999;
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];

    // when & then
    expectAppErrorCode(
      () =>
        couponService.getDiscountPrice(
          notFoundCouponId,
          100000,
          checkoutItems,
          3000,
        ),
      "COUPON_NOT_FOUND",
    );
  });

  test("존재하지 않는 쿠폰이 포함되어 있으면 총 할인 금액 계산 시 COUPON_NOT_FOUND 에러가 발생한다.", () => {
    // given
    const notFoundCouponId = 999999999;
    const checkoutItems = [createCheckoutItem(1, 100000, 1)];

    // when & then
    expectAppErrorCode(
      () =>
        couponService.getTotalDiscountPrice(
          [notFoundCouponId],
          100000,
          checkoutItems,
          3000,
        ),
      "COUPON_NOT_FOUND",
    );
  });
});
