import { PreorderItem, Coupon } from "./types.js";
import { calculateOrderAmount } from "./calculator.js";

export const validateCoupon = (
  items: PreorderItem[],
  coupon: Coupon,
  currentTime: Date,
): boolean => {
  if (items.length === 0) return false;

  if (coupon.expirationDate) {
    const [year, month, day] = coupon.expirationDate.split("-").map(Number);
    const expirationLimit = new Date(year, month - 1, day, 23, 59, 59, 999);

    if (currentTime.getTime() > expirationLimit.getTime()) {
      return false;
    }
  }

  const orderAmount = calculateOrderAmount(items);
  const { minOrderLimit, minBogoQuantity, validTime } = coupon.condition;

  if (minOrderLimit !== undefined && orderAmount < minOrderLimit) {
    return false;
  }

  if (minBogoQuantity !== undefined) {
    const hasBogoTarget = items.some(
      (item) => item.quantity >= minBogoQuantity,
    );
    if (!hasBogoTarget) return false;
  }

  if (validTime !== undefined) {
    const currentHour = currentTime.getHours();
    if (currentHour < validTime.startHour || currentHour >= validTime.endHour) {
      return false;
    }
  }

  return true;
};
