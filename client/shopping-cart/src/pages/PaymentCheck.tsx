import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router';

import AppHeader from '../components/layout/AppHeader';
import PrimaryButton from '../components/common/buttons/PrimaryButton';
import AsyncContent from '../components/common/AsyncContent';
import ProductRawSkeleton from '../components/common/ProductRawSkeleton';

import backIcon from '../assets/back_icon.svg';
import { formatPrice } from '../utils/price';
import { getOrderCheck } from '../apis/orderCheckApi';
import type { OrderCheck } from '../types';

const PaymentCheck = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderCheck>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const loadOrderCheck = async () => {
      try {
        setOrder(await getOrderCheck());
      } catch (error) {
        console.error(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderCheck();
  }, []);

  return (
    <>
      <AppHeader>
        <button
          css={css`
            background: none;
            border: none;
            cursor: pointer;
          `}
          onClick={() => navigate('/')}
        >
          <img src={backIcon} />
        </button>
      </AppHeader>
      <AsyncContent
        isLoading={isLoading}
        isError={isError}
        loadingFallback={
          <ul
            css={css`
              list-style: none;
              margin: 0;
              padding: 0;
            `}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductRawSkeleton key={i} />
            ))}
          </ul>
        }
        errorFallback={<p>결제 확인 정보를 불러오는 데 실패했습니다.</p>}
      >
        {order &&
          (order.products.length === 0 ? (
            <Navigate to="/" />
          ) : (
            <div
              css={css`
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 24px;
              `}
            >
              <h2
                css={css`
                  font: var(--text-heading);
                `}
              >
                결제 확인
              </h2>
              <p
                css={css`
                  font: var(--text-label);
                  text-align: center;
                `}
              >
                총 {order.products.length}종류의 상품{' '}
                {order.products.reduce((acc, item) => acc + item.quantity, 0)}개를 주문합니다.
                <br />
                최종 결제 금액을 확인해주세요.
              </p>
              <section
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 12px;
                `}
              >
                <h3
                  css={css`
                    font: var(--text-subheading);
                  `}
                >
                  총 결제 금액
                </h3>
                <h2
                  css={css`
                    font: var(--text-heading);
                  `}
                >
                  {formatPrice(order.payInfo.totalOrderAmount)}원
                </h2>
              </section>
            </div>
          ))}
      </AsyncContent>
      <PrimaryButton
        text="장바구니로 돌아가기"
        onClick={() => {
          navigate('/');
        }}
      />
    </>
  );
};

export default PaymentCheck;
