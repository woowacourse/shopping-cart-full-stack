import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';

interface PaymentCompleteState {
    productCount: number;
    totalQuantity: number;
    totalAmount: number;
}

export default function PaymentCompletePage() {
    const { state } = useLocation() as { state: PaymentCompleteState };
    const navigate = useNavigate();

    return (
        <PageLayout bottomButtonLabel="장바구니로 돌아가기" onBottomButtonClick={() => navigate('/')}>
            <Container>
                <Heading>결제 확인</Heading>
                <Description>
                    총 {state.productCount}종류의 상품 {state.totalQuantity}개를 주문했습니다.
                </Description>
                <Description>최종 결제 금액을 확인해 주세요.</Description>
                <TotalLabel>총 결제 금액</TotalLabel>
                <TotalAmount>{state.totalAmount.toLocaleString()}원</TotalAmount>
            </Container>
        </PageLayout>
    );
}

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    color: #0a0d13;
    align-self: center;
`;

const Heading = styled.h2`
    font-weight: 700;
    font-size: 24px;
`;

const Description = styled.p`
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    margin: 0;
    text-align: center;
`;

const TotalLabel = styled.strong`
    font-weight: 700;
    font-size: 16px;
`;

const TotalAmount = styled.p`
    font-weight: 700;
    font-size: 24px;
    margin: 0;
`;
