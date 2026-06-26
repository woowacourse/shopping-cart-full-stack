import { css } from "@emotion/react";
import type { CheckoutItem } from "../../../domain/checkout/checkout.api";
import ListItem from "../../../shared/components/Layout/ListItem";
import { formatPrice } from "../../../shared/utils";
import { typography } from "../../../shared/styles/typography";

const CheckoutItemRow = ({ checkoutItem }: { checkoutItem: CheckoutItem }) => {
  const { imgUrl, name, price, itemCount } = checkoutItem;
  return (
    <ListItem
      prefix={
        <img
          src={imgUrl}
          css={css({ width: "112px", height: "112px", borderRadius: " 8px" })}
        />
      }
      title={<span css={typography.bodyMedium}>{name}</span>}
      subTitle={
        <span css={typography.titleLarge}>
          {formatPrice(price * itemCount)}원
        </span>
      }
      detail={<span css={typography.bodySmall}>{itemCount}개</span>}
    ></ListItem>
  );
};

export default CheckoutItemRow;
