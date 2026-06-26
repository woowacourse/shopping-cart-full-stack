import TempOrder from "../models/TempOrder.js";
import {
  DeliveryFee,
  FreeDeliveryPolicy,
  HardPlacePolicy,
} from "../models/DeliveryFee.js";
import {
  AmountDiscountCoupon,
  BonusCoupon,
  FreeDeliveryCoupon,
  RateDiscountCoupon,
} from "../models/Coupon.js";

describe("TempOrder Tests", () => {
  const items = [
    {
      product_id: "123",
      quantity: 2,
      product: {
        name: "민트초코",
        price: 3000,
        thumbnail: "mint-choco.png",
      },
    },
    {
      product_id: "456",
      quantity: 5,
      product: {
        name: "뉴욕치즈 케이크",
        price: 4000,
        thumbnail: "newyork-cheeze.png",
      },
    },
  ];

  const tempOrder = new TempOrder(items, new DeliveryFee(3000, []), []);

  test("배송비를 반환한다.", () => {
    expect(tempOrder.calculateDeliveryFee()).toBe(3000);
  });

  test("총 주문 금액을 반환한다.", () => {
    expect(tempOrder.calculateOrderPrice()).toBe(26000);
  });

  test("특정 갯수 이상 가장 비싼 아이템의 가격을 반환한다.", () => {
    expect(tempOrder.findMostExpensiveItemPrice(2)).toBe(4000);
  });

  test("객체형태로 반환한다.", () => {
    const result = tempOrder.toObject();
    expect(typeof result.id).toBe("string");
    expect(result.hard_delivery_place).toBe(false);
    expect(result.selected_coupons).toEqual([]);
    expect(result.selected_items).toEqual(items);
    expect(result.price_summary).toEqual({
      order_price: 26000,
      discount_price: 0,
      delivery_price: 3000,
      total_price: 29000,
    });
  });

  test("고정 금액 할인 쿠폰이 주문 금액에서 차감된다.", () => {
    const coupon = new AmountDiscountCoupon({
      conditions: [],
      discountPrice: 5000,
    });
    const order = new TempOrder(items, new DeliveryFee(3000, []), [coupon]);
    expect(order.toObject().price_summary).toEqual({
      order_price: 26000,
      discount_price: 5000,
      delivery_price: 3000,
      total_price: 24000,
    });
  });

  test("비율 할인 쿠폰이 주문 금액의 비율만큼 차감된다.", () => {
    const coupon = new RateDiscountCoupon({ conditions: [], discountRate: 10 });
    const order = new TempOrder(items, new DeliveryFee(3000, []), [coupon]);
    expect(order.toObject().price_summary).toEqual({
      order_price: 26000,
      discount_price: 2600,
      delivery_price: 3000,
      total_price: 26400,
    });
  });

  test("배송비 무료 쿠폰이 배송비를 0으로 만든다.", () => {
    const coupon = new FreeDeliveryCoupon({ conditions: [] });
    const order = new TempOrder(items, new DeliveryFee(3000, []), [coupon]);
    expect(order.toObject().price_summary).toEqual({
      order_price: 26000,
      discount_price: 0,
      delivery_price: 0,
      total_price: 26000,
    });
  });

  test("보너스 쿠폰이 가장 비싼 아이템 가격만큼 할인된다.", () => {
    const coupon = new BonusCoupon({
      conditions: [],
      minQuantity: 2,
      bonusCount: 1,
    });
    const order = new TempOrder(items, new DeliveryFee(3000, []), [coupon]);
    expect(order.toObject().price_summary).toEqual({
      order_price: 26000,
      discount_price: 4000,
      delivery_price: 3000,
      total_price: 25000,
    });
  });

  test("총 가격금액보다 할인 금액이 더 클 경우 할인 금액은 총 가격금액이 된다.", () => {
    const coupon = new AmountDiscountCoupon({
      conditions: [],
      discountPrice: 100000,
    });

    const order = new TempOrder(
      items,
      new DeliveryFee(3000, [new FreeDeliveryPolicy(0)]),
      [coupon],
    );
    expect(order.toObject().price_summary["total_price"]).toBe(0);
  });

  test("총 할인금액을 반환한다.", () => {
    const bonusCoupon = new BonusCoupon({
      conditions: [],
      minQuantity: 2,
      bonusCount: 1,
    });
    const freeDeliveryCoupon = new FreeDeliveryCoupon({
      conditions: [],
    });
    const order = new TempOrder(
      items,
      new DeliveryFee(3000, [new HardPlacePolicy(5000)]),
      [bonusCoupon, freeDeliveryCoupon],
    );

    expect(order.totalDiscountPrice()).toBe(12000);
  });
});
