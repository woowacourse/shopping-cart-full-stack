import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../common/Header";
import { Button } from "../common/Button";
import { Checkbox } from "../common/Checkbox";
import { Spinner } from "../common/Spinner";
import {
  getOrderApi,
  patchOrderShippingApi,
  postPaymentApi,
} from "../api/orderApi";
import { CouponModal } from "./CouponModal";
import type { OrderDetail } from "../types/order";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
`;

const TitleSection = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 12px;
  color: #555;
  line-height: 1.6;
`;

const ProductList = styled.ul`
  padding: 0 24px;
`;

const ProductItem = styled.li`
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-top: 1px solid #eee;
`;

const ProductImage = styled.img`
  width: 112px;
  height: 112px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.p`
  font-size: 12px;
  color: #0a0d13;
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
`;

const ProductQuantity = styled.p`
  font-size: 14px;
  color: #555;
`;

const CouponSection = styled.div`
  padding: 16px 24px;
`;

const CouponButton = styled.button`
  width: 100%;
  height: 48px;
  border: 1px solid #ddd;
  background: none;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
`;

const ShippingSection = styled.div`
  padding: 16px 24px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const InfoText = styled.p`
  font-size: 12px;
  color: #555;
  padding: 8px 0;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #eee;
`;

const SummarySection = styled.div`
  padding: 0 0 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
`;

const SummaryLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const SummaryAmount = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

export function OrderCheckPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingShipping, setIsUpdatingShipping] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    getOrderApi(orderId)
      .then((data) => {
        setOrder(data);
      })
      .catch(() => alert("주문 정보를 불러오는 데 실패했습니다."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <Spinner />;
  if (!order) return null;

  const typeCount = order.products.length;
  const totalQuantity = order.products.reduce(
    (sum, product) => sum + product.quantity,
    0,
  );

  const buyXgetYCoupon = order.coupons.find(
    (c) => c.discountType === "buyXgetY",
  );
  const eligibleProducts = order.products.filter((p) => p.quantity >= 2);
  const giftProduct =
    buyXgetYCoupon && eligibleProducts.length > 0
      ? eligibleProducts.reduce((max, p) => (p.price > max.price ? p : max))
      : null;

  async function handlePayment() {
    try {
      const { finalAmount } = await postPaymentApi(
        Number(orderId),
        order!.totalAmount,
      );
      navigate("/payment/confirm", {
        state: { finalAmount, typeCount, totalQuantity },
      });
    } catch (e) {
      const code = e instanceof Error ? e.message : "";
      if (code === "PAYMENT_AMOUNT_MISMATCH") {
        alert("결제 금액이 일치하지 않습니다.");
        navigate("/cart");
      } else if (code === "EXPIRED_COUPON") {
        alert(
          "만료된 쿠폰이 포함되어 있습니다. 쿠폰 정보를 다시 확인해 주세요.",
        );
        getOrderApi(orderId!)
          .then(setOrder)
          .catch(() => alert("주문 정보를 불러오는 데 실패했습니다."));
      } else {
        alert("결제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  }

  async function handleRemoteAreaChange(checked: boolean) {
    const prevOrder = order;
    setIsUpdatingShipping(true);
    setOrder({ ...order!, isRemoteArea: checked });

    try {
      const result = await patchOrderShippingApi(orderId!, checked);
      setOrder((prev) => ({ ...prev!, ...result }));
    } catch {
      setOrder(prevOrder);
      alert("배송지 정보 변경에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsUpdatingShipping(false);
    }
  }

  return (
    <Wrapper>
      <Header onBack={() => navigate("/cart")} />
      <Content>
        <TitleSection>
          <Title>주문 확인</Title>
          <Subtitle>
            총 {typeCount}종류의 상품 {totalQuantity}개를 주문합니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </Subtitle>
        </TitleSection>

        <ProductList>
          {order.products.map((product) => (
            <ProductItem key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{product.price.toLocaleString()}원</ProductPrice>
                <ProductQuantity>{product.quantity}개</ProductQuantity>
              </ProductInfo>
            </ProductItem>
          ))}
        </ProductList>

        <CouponSection>
          <CouponButton onClick={() => setIsModalOpen(true)}>
            쿠폰 적용
          </CouponButton>
        </CouponSection>

        <ShippingSection>
          <SectionTitle>배송 정보</SectionTitle>
          <CheckboxRow>
            <Checkbox
              checked={order.isRemoteArea}
              onChange={handleRemoteAreaChange}
              disabled={isUpdatingShipping}
            />
            <span>제주도 및 도서 산간 지역</span>
          </CheckboxRow>
          <InfoText>
            ⓘ 총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
          </InfoText>
        </ShippingSection>

        <SummarySection>
          <Divider />
          <SummaryRow>
            <SummaryLabel>주문 금액</SummaryLabel>
            <SummaryAmount>{order.orderAmount.toLocaleString()}원</SummaryAmount>
          </SummaryRow>
          {giftProduct && (
            <SummaryRow>
              <SummaryLabel>증정품</SummaryLabel>
              <SummaryAmount style={{ fontSize: "14px" }}>
                {giftProduct.name} 1개 증정 ({buyXgetYCoupon?.title})
              </SummaryAmount>
            </SummaryRow>
          )}
          <SummaryRow>
            <SummaryLabel>쿠폰 할인 금액</SummaryLabel>
            <SummaryAmount>
              -{order.couponDiscount.toLocaleString()}원
            </SummaryAmount>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>배송비</SummaryLabel>
            <SummaryAmount>
              {(order.deliveryFee - order.shippingDiscount).toLocaleString()}원
            </SummaryAmount>
          </SummaryRow>
          <Divider />
          <SummaryRow>
            <SummaryLabel>총 결제 금액</SummaryLabel>
            <SummaryAmount>{order.totalAmount.toLocaleString()}원</SummaryAmount>
          </SummaryRow>
        </SummarySection>
      </Content>

      <Button label="결제하기" onClick={handlePayment} />

      {isModalOpen && (
        <CouponModal
          orderId={orderId!}
          initialSelectedIds={order.coupons.map((coupon) => coupon.id)}
          orderTotal={order.orderAmount}
          deliveryFee={order.deliveryFee}
          onClose={() => setIsModalOpen(false)}
          onApply={(result) => {
            setIsModalOpen(false);
            setOrder((prev) => ({ ...prev!, ...result }));
          }}
        />
      )}
    </Wrapper>
  );
}
