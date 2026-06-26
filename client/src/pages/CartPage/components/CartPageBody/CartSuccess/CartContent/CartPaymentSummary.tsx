import styled from "@emotion/styled";
import { formatPrice } from "../../../../../../shared/utils";
import WarningIcon from "../../../../../../assets/warning.png";
import { DELIVERY } from "../../../../../../domain/cart/cart.constants";
import { typography } from "../../../../../../shared/styles/typography";
import { useCartSelectionContext } from "../../../../CartSelectionContext";
import {
  getDeliveryFee,
  getFilteredCartItem,
  getOrderPrice,
  getTotalPrice,
} from "../../../../../../domain/cart/cart.util";
import type { CartItemModel } from "../../../../../../domain/cart/cart.api";

const CartPaymentSummary = ({ cartItems }: { cartItems: CartItemModel[] }) => {
  const { selectedProductIds } = useCartSelectionContext();
  const filteredCartItem = getFilteredCartItem(cartItems, selectedProductIds);
  const orderPrice = getOrderPrice(filteredCartItem);
  const deliveryFee = getDeliveryFee(orderPrice);
  const totalPrice = getTotalPrice(orderPrice, deliveryFee);

  return (
    <CartPaymentSummaryLayout>
      <WarningSection>
        <WarningIconImage src={WarningIcon} />
        <CartPaymentSummarySpan>
          총 주문 금액이 {formatPrice(DELIVERY.FREE_PRICE_BOUNDARY)}원 이상일
          경우 무료 배송됩니다.
        </CartPaymentSummarySpan>
      </WarningSection>
      <SummaryTable>
        <tbody>
          <SummaryTr>
            <SummaryTh scope="row">주문 금액</SummaryTh>
            <SummaryTd>{formatPrice(orderPrice)}원</SummaryTd>
          </SummaryTr>
          <SummaryTr $hasDivider>
            <SummaryTh scope="row">배송비</SummaryTh>
            <SummaryTd>{formatPrice(deliveryFee)}원</SummaryTd>
          </SummaryTr>
          <SummaryTr>
            <SummaryTh scope="row">총 결제 금액</SummaryTh>
            <SummaryTd>{formatPrice(totalPrice)}원</SummaryTd>
          </SummaryTr>
        </tbody>
      </SummaryTable>
    </CartPaymentSummaryLayout>
  );
};

export default CartPaymentSummary;

const CartPaymentSummaryLayout = styled.div`
  margin-top: 32px;
`;

const WarningSection = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 4px;
  margin-bottom: 12px;
`;

const WarningIconImage = styled.img`
  width: 16px;
  height: 16px;
`;

const CartPaymentSummarySpan = styled.span`
  ${typography.bodySmall}
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid #0000001a;
`;

const SummaryTr = styled.tr<{ $hasDivider?: boolean }>`
  border-bottom: ${({ $hasDivider }) =>
    $hasDivider ? "1px solid #0000001a" : "none"};
`;

const SummaryTh = styled.th`
  ${typography.titleMedium}
  text-align: left;
`;

const SummaryTd = styled.td`
  padding: 12px;
  ${typography.titleLarge}
  text-align: right;
`;
