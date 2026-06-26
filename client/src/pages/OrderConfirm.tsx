import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import Checkbox from '../components/ui/Checkbox';
import CouponModal from '../components/CouponModal';
import { getCoupons, getOrderPreview } from '../api/coupon';
import type { CartItemType } from '../types/cartItemType';
import type { Coupon, OrderPreviewResponse } from '../types/couponType';

interface OrderConfirmState {
  products: CartItemType[];
  orderAmount: number;
  couponDiscount: number;
  deliveryFee: number;
  totalAmount: number;
}

function OrderConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as OrderConfirmState;

  const selectedItemIds = state.products.map((p) => p.id);

  const [isRemoteArea, setIsRemoteArea] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [appliedCouponIds, setAppliedCouponIds] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftCouponIds, setDraftCouponIds] = useState<number[]>([]);
  const [draftDiscount, setDraftDiscount] = useState(0);
  const [preview, setPreview] = useState<OrderPreviewResponse>({
    orderAmount: state.orderAmount,
    couponDiscount: state.couponDiscount,
    deliveryFee: state.deliveryFee,
    originalDeliveryFee: state.deliveryFee,
    totalPrice: state.totalAmount,
    appliedCoupons: [],
    couponStatuses: [],
  });

  const fetchPreview = useCallback(
    async (couponIds: number[]) => {
      return getOrderPreview({
        mode: 'manual',
        selectedItemIds,
        coupons: couponIds,
        isRemoteArea,
      });
    },
    [selectedItemIds, isRemoteArea],
  );

  const fetchPreviewAuto = useCallback(
    async () => {
      return getOrderPreview({
        mode: 'auto',
        selectedItemIds,
        isRemoteArea,
      });
    },
    [selectedItemIds, isRemoteArea],
  );

  useEffect(() => {
    getCoupons()
      .then(setCoupons)
      .catch((error) => console.error(error));
  }, []);

  const isInitialized = useRef(false);

  useEffect(() => {
    fetchPreviewAuto()
      .then((result) => {
        setPreview(result);
        setAppliedCouponIds(result.appliedCoupons);
        isInitialized.current = true;
      })
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // isRemoteArea가 바뀌면 현재 쿠폰을 유지한 채 금액을 다시 계산한다.
  // isInitialized 가드는 진입 직후 초기화 effect와의 경쟁을 막는다.
  useEffect(() => {
    if (!isInitialized.current) return;
    fetchPreview(appliedCouponIds)
      .then(setPreview)
      .catch((error) => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRemoteArea]);

  const openModal = () => {
    setDraftCouponIds(appliedCouponIds);
    setIsModalOpen(true);
  };

  // FREESHIPPING처럼 배송비만 줄이는 쿠폰도 할인으로 보이도록 배송비 절감액을 합산한다.
  useEffect(() => {
    if (!isModalOpen) return;
    fetchPreview(draftCouponIds)
      .then((result) => {
        const deliverySaving = result.originalDeliveryFee - result.deliveryFee;
        setDraftDiscount(result.couponDiscount + deliverySaving);
      })
      .catch((error) => console.error(error));
  }, [isModalOpen, draftCouponIds, fetchPreview]);

  const toggleDraftCoupon = (id: number) => {
    setDraftCouponIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const applyCoupons = async () => {
    const result = await fetchPreview(draftCouponIds);
    setPreview(result);
    setAppliedCouponIds(result.appliedCoupons);
    setIsModalOpen(false);
  };

  const goToConfirm = () => {
    navigate('/confirm', {
      state: {
        totalAmount: preview.totalPrice,
        productCount: state.products.length,
        totalQuantity: state.products.reduce((sum, p) => sum + p.quantity, 0),
      },
    });
  };

  const deliverySaving = preview.originalDeliveryFee - preview.deliveryFee;
  const displayDiscount = preview.couponDiscount + deliverySaving;

  return (
    <PageContainer>
      <Banner>
        <button id="back-button" onClick={() => navigate(-1)}>
          <svg
            width="25"
            height="23"
            viewBox="0 0 25 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.9209 11.3537L0.749595 10.4167L-3.8743e-05 11.3537L0.749595 12.2908L1.9209 11.3537ZM22.7542 12.8537C23.5827 12.8537 24.2542 12.1821 24.2542 11.3537C24.2542 10.5253 23.5827 9.85371 22.7542 9.85371V12.8537ZM9.08293 -2.98023e-07L0.749595 10.4167L3.0922 12.2908L11.4255 1.87408L9.08293 -2.98023e-07ZM0.749595 12.2908L9.08293 22.7074L11.4255 20.8333L3.0922 10.4167L0.749595 12.2908ZM1.9209 12.8537H22.7542V9.85371H1.9209V12.8537Z"
              fill="white"
            />
          </svg>
        </button>
      </Banner>

      <ContentArea>
        <TitleSection>
          <h1 id="order-title">주문 확인</h1>
          <p id="order-summary">
            총 {state.products.length}종류의 상품{' '}
            {state.products.reduce((sum, p) => sum + p.quantity, 0)}개를 주문합니다.
            <br />
            최종 결제 금액을 확인해 주세요.
          </p>
        </TitleSection>

        <ProductList>
          {state.products.map((item) => (
            <ProductContainer key={item.id}>
              <img src={item.imageUrl} />
              <div id="product-description">
                <h2 id="item-name">{item.name}</h2>
                <h2 id="item-price">{item.price.toLocaleString()}원</h2>
                <p id="item-quantity">{item.quantity}개</p>
              </div>
            </ProductContainer>
          ))}
        </ProductList>

        <CouponButton onClick={openModal}>쿠폰 적용</CouponButton>

        <DeliverySection>
          <h2 id="delivery-title">배송 정보</h2>
          <Checkbox
            checked={isRemoteArea}
            onChange={setIsRemoteArea}
            label="제주도 및 도서 산간 지역"
          />
        </DeliverySection>

        <DescriptionRow>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 3.33333H7.33333V4.66667H6V3.33333ZM6 6H7.33333V10H6V6ZM6.66667 0C2.98667 0 0 2.98667 0 6.66667C0 10.3467 2.98667 13.3333 6.66667 13.3333C10.3467 13.3333 13.3333 10.3467 13.3333 6.66667C13.3333 2.98667 10.3467 0 6.66667 0ZM6.66667 12C3.72667 12 1.33333 9.60667 1.33333 6.66667C1.33333 3.72667 3.72667 1.33333 6.66667 1.33333C9.60667 1.33333 12 3.72667 12 6.66667C12 9.60667 9.60667 12 6.66667 12Z"
              fill="black"
            />
          </svg>
          <p id="summary-description">총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.</p>
        </DescriptionRow>

        <SummaryWrapper>
          <div id="summary-row">
            <h2>주문 금액</h2>
            <p>{preview.orderAmount.toLocaleString()}원</p>
          </div>
          <div id="summary-row">
            <h2>쿠폰 할인 금액</h2>
            <p>-{displayDiscount.toLocaleString()}원</p>
          </div>
          <div id="summary-row">
            <h2>배송비</h2>
            <p>{preview.originalDeliveryFee.toLocaleString()}원</p>
          </div>
        </SummaryWrapper>

        <SummaryWrapper>
          <div id="summary-row">
            <h2>총 결제 금액</h2>
            <p>{preview.totalPrice.toLocaleString()}원</p>
          </div>
        </SummaryWrapper>
      </ContentArea>

      <PaymentButton onClick={goToConfirm}>결제하기</PaymentButton>

      {isModalOpen && (
        <CouponModal
          coupons={coupons}
          couponStatuses={preview.couponStatuses}
          selectedIds={draftCouponIds}
          discount={draftDiscount}
          onToggle={toggleDraftCoupon}
          onClose={() => setIsModalOpen(false)}
          onApply={applyCoupons}
        />
      )}
    </PageContainer>
  );
}

export default OrderConfirm;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Banner = styled.div`
  background-color: #000000;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  padding-left: 1.5rem;
  display: flex;
  align-items: center;

  #back-button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 2.25rem 1.5rem 6.5rem 1.5rem;
  overflow-y: auto;
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;

  #order-title {
    font-family: Noto Sans KR;
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
  }

  #order-summary {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0%;
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductContainer = styled.div`
  padding-top: 0.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-top: 1px solid #0000001a;
  margin-top: 0.75rem;

  img {
    width: 7rem;
    height: 7rem;
    border-radius: 5px;
  }

  #product-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1.25rem;
    flex: 1;
  }

  #item-name {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
    vertical-align: middle;
    margin-bottom: 0.25rem;
  }

  #item-price {
    font-family: Noto Sans KR;
    font-weight: 700;
    font-style: Bold;
    font-size: 24px;
    line-height: 100%;
    letter-spacing: 0%;
    vertical-align: middle;
    margin-bottom: 1.5rem;
  }

  #item-quantity {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
    vertical-align: middle;
  }
`;

const CouponButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  height: 4rem;
  margin-top: 1.5rem;
  border-radius: 4px;
  border: 1px solid #0000001a;
  background-color: white;
  cursor: pointer;

  font-family: Noto Sans;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
`;

const DeliverySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;

  #delivery-title {
    font-family: Noto Sans;
    font-weight: 700;
    font-style: Bold;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0%;
    vertical-align: middle;
  }
`;

const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 1.5rem;

  #summary-description {
    font-family: Noto Sans;
    font-weight: 500;
    font-style: Display Medium;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
  }
`;

const SummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #0000001a;
  padding-top: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.75rem;
  gap: 0.5rem;

  #summary-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex: 1;

    h2 {
      font-family: Noto Sans;
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
      line-height: 16px;
      letter-spacing: 0%;
      vertical-align: middle;
    }

    p {
      font-family: Noto Sans KR;
      font-weight: 700;
      font-style: Bold;
      font-size: 24px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: right;
      vertical-align: middle;
    }
  }
`;

const PaymentButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 580px;
  height: 64px;
  background-color: #000000;
  color: #ffffff;
  border: none;
  cursor: pointer;

  font-family: Noto Sans;
  font-weight: 700;
  font-style: Bold;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
`;
