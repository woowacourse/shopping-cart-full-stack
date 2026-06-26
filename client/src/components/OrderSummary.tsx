import styled from '@emotion/styled';

interface OrderInfo {
    summaryType: string;
    summaryAmount: number;
    // 총 결제 금액을 새로운 prop 필드 만들어서 전달할까? 지금처럼 내부적으로 계산할까?
    // 단일 진실 공급원, 구현에 의존하지 않는 interface 관점에서 뭐가 나을까
    // 단순한 계산이라 내부에서 하는게 맞는 선택이라면 단순함의 기준은 어떻게 정해야되지
}

interface OrderSummaryProps {
    orderInfos: OrderInfo[];
}

export default function OrderSummary({ orderInfos }: OrderSummaryProps) {
    const totalAmount = orderInfos.reduce((sum, { summaryAmount }) => sum + summaryAmount, 0);

    return (
        <OrderSummarySection>
            <OrderDetailSection>
                {orderInfos.map((orderInfo) => (
                    <OrderTypeAmount>
                        <OrderType>{orderInfo.summaryType}</OrderType>
                        <OrderAmount>{orderInfo.summaryAmount.toLocaleString()}원</OrderAmount>
                    </OrderTypeAmount>
                ))}
            </OrderDetailSection>
            <OrderResultSection>
                <OrderTypeAmount>
                    <OrderType>총 결제 금액</OrderType>
                    <OrderAmount>{totalAmount.toLocaleString()}원</OrderAmount>
                </OrderTypeAmount>
            </OrderResultSection>
        </OrderSummarySection>
    );
}

const OrderSummarySection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 40px;
`;

const OrderDetailSection = styled.div`
    border-top: 1px solid #0000001a;
    border-bottom: 1px solid #0000001a;
    padding: 12px 0;
    box-sizing: content-box;
    gap: 8px;
`;

const OrderResultSection = styled.div`
    margin-top: 12px;
`;

const OrderTypeAmount = styled.div`
    display: flex;
    justify-content: space-between;
    height: 42px;
    align-items: center;
`;

const OrderType = styled.p`
    font-weight: 700;
    font-size: 16px;
    line-height: 16px;
    margin: 0;
`;

const OrderAmount = styled.p`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    margin: 0;
`;
