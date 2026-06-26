import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';

interface PayConfirmState {
    productCount: number;
    totalQuantity: number;
    totalAmount: number;
}

export default function PayConfirmPage() {
    const { state } = useLocation() as { state: PayConfirmState };
    const navigate = useNavigate();

    return (
        <PageLayout
            bottomButtonLabel="장바구니로 돌아가기"
            onBottomButtonClick={() => navigate('/')}
            showBackButton
            isBottomButtonDisabled
        >
            <CenteredContainer>
                <Section>
                    <h3>결제 확인</h3>
                    <p>
                        총 {state.productCount}종류의 상품 {state.totalQuantity}개를 주문합니다.
                    </p>
                    <p>최종 결제 금액을 확인해 주세요.</p>
                </Section>
                <TotalSection>
                    <strong>총 결제 금액</strong>
                    <TotalAmount>{state.totalAmount.toLocaleString()}원</TotalAmount>
                </TotalSection>
            </CenteredContainer>
        </PageLayout>
    );
}

const CenteredContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 36px;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 36px;

    h3 {
        font-weight: 700;
        font-size: 24px;
        margin: 0;
    }

    p {
        font-size: 12px;
        font-weight: 500;
        line-height: 150%;
        margin: 0;
    }
`;

const TotalSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 11px;

    strong {
        font-weight: 700;
        font-size: 20px;
        line-height: 16px;
    }
`;

const TotalAmount = styled.p`
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
`;
