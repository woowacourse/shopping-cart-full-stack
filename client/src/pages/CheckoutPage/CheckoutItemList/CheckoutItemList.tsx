import type { CheckoutItem } from "../../../domain/checkout/checkout.api";
import List from "../../../shared/components/Layout/List";
import CheckoutItemRow from "./CheckoutItemRow";

const CheckoutItemList = ({
  checkoutItems,
}: {
  checkoutItems: CheckoutItem[];
}) => {
  return (
    <List gap="8px">
      {checkoutItems.map((checkoutItem) => (
        <CheckoutItemRow
          key={checkoutItem.productId}
          checkoutItem={checkoutItem}
        />
      ))}
    </List>
  );
};

export default CheckoutItemList;
