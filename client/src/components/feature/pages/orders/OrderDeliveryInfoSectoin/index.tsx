import Spacing from "@components/common/shared/layout/Spacing";
import CheckBox from "@components/common/shared/ui/CheckBox";
import styled from "@emotion/styled";
import useOrderUpdateMutation from "@hooks/feature/mutation/useOrderUpdateMutation";
import useOrderQuery from "@hooks/feature/query/useOrderQuery";

function OrderDeliveryInfoSection() {
  const {
    data: { isIsland },
  } = useOrderQuery();

  const { mutate } = useOrderUpdateMutation();

  return (
    <OrderDeliveryInfoWrapper>
      <OrderDeliveryInfoTitle>배송 정보</OrderDeliveryInfoTitle>
      <Spacing size={1} />
      <OrderDeliveryInfoLabel>
        <CheckBox
          checked={isIsland}
          onChange={() => mutate({ isIsland: !isIsland })}
        />
        제주도 및 도서 산간 지역
      </OrderDeliveryInfoLabel>
    </OrderDeliveryInfoWrapper>
  );
}

const OrderDeliveryInfoWrapper = styled.div``;

const OrderDeliveryInfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
`;

const OrderDeliveryInfoLabel = styled.label`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
`;

export default OrderDeliveryInfoSection;
