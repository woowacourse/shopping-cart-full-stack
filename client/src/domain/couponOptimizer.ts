import { validateCoupon, generateOrderReceipt } from "@cart/shared";
import type { PreorderItem, Coupon } from "@cart/shared";

export const findBestCouponCombination = (
  items: PreorderItem[],
  availableCoupons: Coupon[],
  isRemoteArea: boolean,
): Coupon[] => {
  const mockServerTime = new Date();

  const noCoupon: Coupon[][] = [[]];
  const singleCombinations: Coupon[][] = availableCoupons.map((coupon) => [coupon]);
  const doubleCombinations: Coupon[][] = availableCoupons
    .map((coupon, index) => availableCoupons.slice(index + 1).map((nextCoupon) => [coupon, nextCoupon]))
    .reduce((acc, curr) => acc.concat(curr), []);

  const allCombinations = [
    ...noCoupon,
    ...singleCombinations,
    ...doubleCombinations,
  ];

  const baseReceipt = generateOrderReceipt(
    items,
    [],
    isRemoteArea,
    mockServerTime,
  );
  const basePaymentAmount = baseReceipt.priceSummary.totalPaymentAmount;

  const evaluatedCombinations = allCombinations.map((combo) => {
    const isValid = combo.every((coupon) =>
      validateCoupon(items, coupon, mockServerTime),
    );
    if (!isValid) return { combo, value: -1 };

    const receipt = generateOrderReceipt(
      items,
      combo,
      isRemoteArea,
      mockServerTime,
    );

    const savedMoney =
      basePaymentAmount - receipt.priceSummary.totalPaymentAmount;

    const bogoValue = (receipt.giftItems || []).reduce((acc, gift) => {
      const originItem = items.find((item) => item.productId === gift.productId);
      return acc + (originItem ? originItem.price * gift.giftQuantity : 0);
    }, 0);

    return { combo, value: savedMoney + bogoValue };
  });

  const bestResult = evaluatedCombinations.reduce((prev, current) =>
    current.value > prev.value ? current : prev,
  );

  return bestResult.combo;
};
