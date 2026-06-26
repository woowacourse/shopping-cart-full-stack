import {
  DeliveryFee,
  DeliveryFeePolicy,
  FreeDeliveryPolicy,
  HardPlacePolicy,
} from "../models/DeliveryFee.js";

describe("DeliveryFee Tests", () => {
  class FlatFeePolicy implements DeliveryFeePolicy {
    private readonly extraFee: number;

    constructor(extraFee: number) {
      this.extraFee = extraFee;
    }

    calculate() {
      return this.extraFee;
    }
  }

  test("배송비는 정책에 따른 비용을 합하여 반환한다.", () => {
    const deliveryFee = new DeliveryFee(2000, [new FlatFeePolicy(10000)]);
    expect(deliveryFee.getDeliveryFee(0)).toBe(12000);
  });

  test("도서/산간 지역은 추가 배송비가 존재한다.", () => {
    const hardPlacePolicy = new HardPlacePolicy(5000);
    const deliveryFee = new DeliveryFee(3000, [hardPlacePolicy]);
    expect(deliveryFee.getDeliveryFee(0)).toBe(8000);
  });

  test("도서/산간 지역에 대한 여부를 반환한다.", () => {
    const withHardPlace = new DeliveryFee(5000, [new HardPlacePolicy(3000)], true);
    const withoutHardPlace = new DeliveryFee(5000, []);

    expect(withHardPlace.isHardPlace()).toBe(true);
    expect(withoutHardPlace.isHardPlace()).toBe(false);
  });

  test("특정 금액 이상이면 배송비는 무료이다.", () => {
    const deliveryFee = new DeliveryFee(3000, [new FreeDeliveryPolicy(50000)]);
    expect(deliveryFee.getDeliveryFee(50000)).toBe(0);
  });

  test("도서/산간 지역이더라도 무료 배송 조건을 충족하면 배송비는 0원이다.", () => {
    const deliveryFee = new DeliveryFee(3000, [
      new HardPlacePolicy(5000),
      new FreeDeliveryPolicy(50000),
    ]);
    expect(deliveryFee.getDeliveryFee(50000)).toBe(0);
  });
});

describe("FreeDeliveryPolicy Tests", () => {
  test("특정 금액이상이면 전달된 금액이 음수로 반환된다.", () => {
    const policy = new FreeDeliveryPolicy(50000);

    expect(policy.calculate(50000, 50000)).toBe(-50000);
    expect(policy.calculate(40000, 40000)).toBe(0);
  });
});
