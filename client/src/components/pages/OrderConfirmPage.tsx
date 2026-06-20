import styled from "styled-components";
import { Navigate, useLocation, useParams } from "react-router-dom";

import BackButton from "../button/BackButton";
import ShoppingCartSkeleton from "../skeleton/ShoppingCartSkeleton";
import useOrderData from "../../hooks/useOrderData";
import useCouponData from "../../hooks/useCouponData";
import OrderCartList from "../order/OrderCartList";

export default function OrderConfirmPage() {
  // const location = useLocation();
  // if (!location.state) {
  //   return <Navigate to="/cart" replace />;
  // }
  const { orderId } = useParams();
  const { orderState, orderData, onDelete, updateAppliedCoupon } = useOrderData(
    Number(orderId),
  );
  const { couponState, fetchData, couponData } = useCouponData(Number(orderId));

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

            {/* <ApplyCouponButton/> 쿠폰 적용 버튼(쿠폰 모달 여는 버튼) */}
            {/* <ShippingInfo/> 배송 정보(제주도 및 도서 산간 지역 체크, PATCH/:orderId/address ) */}
            {/* <FinalResultOrder/>  주문금액, 쿠폰 할인 금액, 배송비, 총 결제 금액 */}
            {/* <paymentButton/> 결제하기 버튼(POST/order/:orderid/payment) */}
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
