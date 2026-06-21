import styled from "styled-components";
import { Navigate, useLocation, useParams } from "react-router-dom";

import BackButton from "../button/BackButton";
import ShoppingCartSkeleton from "../skeleton/ShoppingCartSkeleton";
import useOrderData from "../../hooks/useOrderData";
import useCouponData from "../../hooks/useCouponData";
import OrderCartList from "../order/OrderCartList";
import ApplyCouponButton from "../button/ApplyCouponButton";
import ShippingInfo from "../order/ShippingInfo";
import FinalResultOrder from "../order/FinalResultOrder";
import PaymentButton from "../button/PaymentButton";

export default function OrderConfirmPage() {
  const { orderId } = useParams();
  const {
    orderState,
    orderData,
    onDelete,
    updateAppliedCoupon,
    orderFetchData,
  } = useOrderData(Number(orderId));
  const { couponState, couponFetchData, couponData } = useCouponData(
    Number(orderId),
  );

  return (
    <MainContainer>
      {orderState.status === "loading" && <ShoppingCartSkeleton />}
      {orderState.status === "error" && (
        <ErrorMessage>
          주문 확인 페이지를 불러오는 데 실패했습니다.
        </ErrorMessage>
      )}
      {orderState.status === "success" && orderData && (
        <Body>
          <Nav>
            <BackButton />
          </Nav>
          <SubContainer>
            <TopSection>
              <Title> 주문 확인 </Title>
              <Label>
                현재 {orderData.items.length} 종류의 상품{" "}
                {orderData.items.reduce((acc, item) => acc + item.quantity, 0)}
                개를 주문합니다. <br />
                최종 결제 금액을 확인해주세요.
              </Label>
            </TopSection>

            <OrderCartList items={orderData.items} />
            <ApplyCouponButton
              orderId={orderData.orderId}
              couponData={couponData}
              orderData={orderData}
              updateAppliedCoupon={updateAppliedCoupon}
            />
            <ShippingInfo
              orderData={orderData}
              onRemoteAreaChange={orderFetchData}
            />

            <FinalResultOrder orderData={orderData} />
            <PaymentButton orderId={orderData.orderId} />
          </SubContainer>
        </Body>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100vh;
  overflow: hidden;
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 430px;
  height: 100vh;
  overflow: hidden;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: #000000;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  overflow: hidden;
  flex: 1;
  padding: 24px;
  box-sizing: border-box;
`;

const TopSection = styled.div`
  width: 100%;
  height: 62px;
  margin-bottom: 24px;
`;
const Title = styled.div`
  font-size: 24px;
  font-family: sans-serif;
  font-weight: 700;
`;

const Label = styled.div`
  font-size: 12px;
  font-family: sans-serif;
  font-weight: 500;
`;

const ErrorMessage = styled.p`
  margin-top: 40px;
  font-size: 14px;
  color: #888;
`;
