import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import { useModal } from '../components/modal/useModal';
import CouponCheckModal from '../components/CouponCheckModal';
import OrderItemCard from '../components/OrderItemCard';
import CheckBox from '../components/CheckBox';
import OrderSummary from '../components/OrderSummary';
import { useOrderCheck } from '../hooks/useOrderCheck';

export default function OrderConfirmPage() {
    const {
        products,
        payInfo,
        remoteAreaChecked,
        apiStatus,
        productCount,
        totalQuantity,
        orderInfos,
        freeDeliveryThreshold,
        handleRemoteAreaToggle,
        refreshPayInfo,
    } = useOrderCheck();

    const { open } = useModal();
    const navigate = useNavigate();

    const handleCouponApply = async () => {
        await open<void>((close) => <CouponCheckModal close={() => close()} />);
        await refreshPayInfo();
    };

    const handlePayment = () => {
        navigate('/payment-complete', {
            state: { productCount, totalQuantity, totalAmount: payInfo.totalOrderAmount },
        });
    };

    return (
        <PageLayout bottomButtonLabel="결제하기" onBottomButtonClick={handlePayment} showBackButton>
            {apiStatus === 'loading' && <p>로딩 중...</p>}
            {apiStatus === 'error' && <p>주문 정보를 불러오지 못했습니다.</p>}
            {apiStatus === 'success' && (
                <>
                    <HeadingContents>
                        <Heading>주문 확인</Heading>
                        <Description>
                            총 {productCount}종류의 상품 {totalQuantity}개를 주문합니다.
                        </Description>
                        <Description>최종 결제 금액을 확인해 주세요.</Description>
                    </HeadingContents>
                    <Divider />
                    <ProductList>
                        {products.map((product) => (
                            <OrderItemCard key={product.id} product={product} quantity={product.quantity} />
                        ))}
                    </ProductList>
                    <CouponApplyButton onClick={handleCouponApply}>쿠폰 적용</CouponApplyButton>
                    <ShippingSection>
                        <ShippingTitle>배송 정보</ShippingTitle>
                        <RemoteAreaRow onClick={handleRemoteAreaToggle}>
                            <CheckBox checked={remoteAreaChecked} />
                            <RemoteAreaLabel>제주도 및 도서 산간 지역</RemoteAreaLabel>
                        </RemoteAreaRow>
                        <FreeShippingNotice>
                            <NoticeIcon>ⓘ</NoticeIcon>총 주문 금액이 {freeDeliveryThreshold.toLocaleString()}원 이상일
                            경우 무료 배송됩니다.
                        </FreeShippingNotice>
                    </ShippingSection>
                    <Divider />
                    <OrderSummary orderInfos={orderInfos} />
                </>
            )}
        </PageLayout>
    );
}

const HeadingContents = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 36px 0 24px;
`;

const Heading = styled.h3`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    margin: 0 0 4px;
`;

const Description = styled.p`
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    margin: 0;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #0000001a;
    margin: 0;
`;

const ProductList = styled.div`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
`;

const CouponApplyButton = styled.button`
    width: 100%;
    height: 56px;
    background-color: white;
    border: 1px solid #0000001a;
    border-radius: 8px;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    margin: 16px 0;
`;

const ShippingSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
`;

const ShippingTitle = styled.h4`
    font-weight: 700;
    font-size: 16px;
    margin: 0;
`;

const RemoteAreaRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
`;

const RemoteAreaLabel = styled.span`
    font-weight: 500;
    font-size: 14px;
`;

const FreeShippingNotice = styled.p`
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #333333;
    margin: 0;
`;

const NoticeIcon = styled.span`
    font-size: 12px;
`;
