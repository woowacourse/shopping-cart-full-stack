import { css } from "@emotion/react";
import List from "../../shared/components/Layout/List";
import ListItem from "../../shared/components/Layout/ListItem";
import { formatPrice } from "../../shared/utils";
import { typography } from "../../shared/styles/typography";
import { DELIVERY } from "../../domain/cart/cart.constants";
import WarningIcon from "../../assets/warning.png";
import styled from "@emotion/styled";

const CheckoutPaymentSummary = ({
  orderPrice,
  couponDiscountPrice,
  deliveryFee,
  totalPrice,
}: {
  orderPrice: number;
  couponDiscountPrice: number;
  deliveryFee: number;
  totalPrice: number;
}) => {
  return (
    <List gap="4px">
      <ListItem
        prefix={
          <img src={WarningIcon} css={css({ width: "16px", height: "16px" })} />
        }
        title={
          <span css={typography.bodyMedium}>
            총 주문 금액이 {formatPrice(DELIVERY.FREE_PRICE_BOUNDARY)}원 이상일
            경우 무료 배송됩니다.
          </span>
        }
      />
      <Divider />
      <ListItem
        title={<span css={typography.titleMedium}>주문금액</span>}
        suffix={
          <span css={typography.titleLarge}>{formatPrice(orderPrice)}원</span>
        }
      />
      <ListItem
        title={<span css={typography.titleMedium}>쿠폰 할인 금액</span>}
        suffix={
          <span css={typography.titleLarge}>
            -{formatPrice(couponDiscountPrice)}원
          </span>
        }
      />
      <ListItem
        title={<span css={typography.titleMedium}>배송비</span>}
        suffix={
          <span css={typography.titleLarge}>{formatPrice(deliveryFee)}원</span>
        }
      />
      <Divider />
      <ListItem
        title={<span css={typography.titleMedium}>총 결제 금액</span>}
        suffix={
          <span css={typography.titleLarge}>{formatPrice(totalPrice)}원</span>
        }
      />
    </List>
  );
};

export default CheckoutPaymentSummary;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #0000001a;
  margin-bottom: 12px;
`;
