import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import { useLocation, useNavigate } from "react-router-dom";
import Arrow from "../../assets/arrow.svg";
import type { ShoppingCartItem } from "../shoppingCart/types";
import { BASE_URL } from "./constants/constant";
import { useCoupons } from "./hooks/useCoupons";
import { useOrderCalculation } from "./hooks/useOrderCalculation";
import CouponModal from "./components/CouponModal";
import OrderSummary from "./components/OrderSummary";
import ShippingOption from "./components/ShippingOption";

export default function CheckOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems: ShoppingCartItem[] = location.state?.selectedItems ?? [];

  const [selectedCouponIds, setSelectedCouponIds] = useState<number[]>([]);
  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payError, setPayError] = useState("");

  const {
    coupons,
    isLoading: isCouponsLoading,
    error: couponsError,
  } = useCoupons();

  const calculationItems = useMemo(
    () =>
      selectedItems.map((item) => ({
        price: item.product.price,
        quantity: item.quantity,
      })),
    [selectedItems],
  );

  const { calculation, error: calculationError } = useOrderCalculation(
    calculationItems,
    selectedCouponIds,
    isRemoteArea,
  );

  const totalProductsTypeCount = selectedItems.length;
  const totalProductsQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const handlePay = async () => {
    // 계산이 실패했거나 아직 없는 상태면 결제를 진행하지 않는다.
    if (calculationError || !calculation) {
      setPayError("결제 금액을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/coupons/validation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponIds: selectedCouponIds }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ?? "결제에 실패했습니다.");
      }

      navigate("/payment", {
        state: {
          totalPayment: calculation?.totalPayment ?? 0,
          totalProductsTypeCount,
          totalProductsQuantity,
        },
      });
    } catch (error) {
      console.error(error);
      setPayError(
        error instanceof Error ? error.message : "결제에 실패했습니다.",
      );
    }
  };

  return (
    <Container>
      <Header>
        <img onClick={() => navigate(-1)} src={Arrow} alt="뒤로가기" />
      </Header>

      <Main>
        <h2>주문 확인</h2>
        <OrderIntro>
          <p>
            총 {totalProductsTypeCount}종류의 상품 {totalProductsQuantity}개를
            주문합니다.
          </p>
          <p>최종 결제 금액을 확인해 주세요.</p>
        </OrderIntro>

        <ItemList>
          {selectedItems.map((item) => (
            <Item key={item.product.id}>
              <img src={item.product.image} alt="상품 이미지" />
              <ItemInfo>
                <strong>{item.product.name}</strong>
                <span>{item.product.price.toLocaleString()}원</span>
                <em>{item.quantity}개</em>
              </ItemInfo>
            </Item>
          ))}
        </ItemList>

        <CouponApplyButton onClick={() => setIsModalOpen(true)}>
          쿠폰 적용
        </CouponApplyButton>

        <ShippingOption isRemoteArea={isRemoteArea} onToggle={setIsRemoteArea} />

        <OrderSummary
          orderAmount={calculation?.orderAmount ?? 0}
          discountAmount={calculation?.discountAmount ?? 0}
          shippingFee={calculation?.shippingFee ?? 0}
          totalPayment={calculation?.totalPayment ?? 0}
        />

        {calculationError && <PayError role="alert">{calculationError}</PayError>}
        {payError && <PayError role="alert">{payError}</PayError>}
      </Main>

      <PayButton
        onClick={handlePay}
        disabled={selectedItems.length === 0 || !!calculationError || !calculation}
      >
        결제하기
      </PayButton>

      {isModalOpen && (
        <CouponModal
          coupons={coupons}
          isLoading={isCouponsLoading}
          error={couponsError}
          items={calculationItems}
          isRemoteArea={isRemoteArea}
          selectedCouponIds={selectedCouponIds}
          onApply={(ids) => {
            setSelectedCouponIds(ids);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 24px;
`;

const Header = styled.header`
  background-color: rgba(0, 0, 0, 1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding-inline: 24px;
  display: flex;
  align-items: center;

  img {
    cursor: pointer;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 24px;

  h2 {
    margin: 0;
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    color: rgba(0, 0, 0, 1);
  }
`;

const OrderIntro = styled.section`
  font-family: "Noto Sans", sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 150%;
  color: rgba(10, 13, 19, 1);

  p {
    margin: 0;
  }
`;

const ItemList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: rgba(10, 13, 19, 1);
  }

  span {
    font-family: "Noto Sans", sans-serif;
    font-weight: 700;
    font-size: 20px;
    color: rgba(0, 0, 0, 1);
  }

  em {
    font-style: normal;
    font-family: "Noto Sans", sans-serif;
    font-weight: 500;
    font-size: 12px;
    color: rgba(10, 13, 19, 0.7);
  }
`;

const CouponApplyButton = styled.button`
  height: 52px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 1);
  cursor: pointer;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: rgba(10, 13, 19, 1);
`;

const PayError = styled.p`
  margin: 0;
  font-family: "Noto Sans", sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: rgb(220, 38, 38);
`;

const PayButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 1);
  border: none;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Noto Sans", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
