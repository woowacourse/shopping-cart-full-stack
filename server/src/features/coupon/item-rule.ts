import { CheckoutCart, ItemRule } from "./coupon.type.js";

export function filterByItemRule(items: CheckoutCart[], itemRule: ItemRule): CheckoutCart[] {
  switch (itemRule.type) {
    case "MIN_QUANTITY":
      return items.filter((item) => item.quantity >= itemRule.minQuantity);
  }
}
