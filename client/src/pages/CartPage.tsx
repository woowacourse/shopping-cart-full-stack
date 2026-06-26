import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import CartItems from '../components/CartItems';
import PageLayout from '../layouts/PageLayout';
import { useCart } from '../hooks/useCart';
import OrderSummary from '../components/OrderSummary';
import { FREE_DELIVERY_THRESHOLD } from '../utils/orderSummary';

export default function CartPage() {
    const {
        products,
        quantityStatus,
        checkStatus,
        isAllChecked,
        payInfo,
        apiStatus,
        handleIncrease,
        handleDecrease,
        handleToggle,
        handleToggleAll,
        remove,
    } = useCart();

    const totalQuantity = products.reduce((sum, _, i) => sum + (checkStatus[i] ? quantityStatus[i] : 0), 0);
    const isButtonDisabled = apiStatus !== 'success' || !checkStatus.some(Boolean);
    const navigate = useNavigate();
    const handleOrder = () => {
        navigate('/order-confirm', {
            state: {
                productCount: checkStatus.filter(Boolean).length,
                totalQuantity,
                totalAmount: payInfo.totalOrderAmount,
            },
        });
    };

    return (
        <PageLayout
            bottomButtonLabel="주문 확인"
            onBottomButtonClick={handleOrder}
            isBottomButtonDisabled={isButtonDisabled}
        >
            {apiStatus === 'loading' && <p>로딩 중...</p>}
            {apiStatus === 'error' && <p>상품을 불러오지 못했습니다.</p>}
            {apiStatus === 'success' && (
                <>
                    <HeadingContents>
                        <Heading>장바구니</Heading>
                        {products.length > 0 && (
                            <CartDescription>
                                현재 {checkStatus.filter(Boolean).length}종류의 상품이 담겨있습니다.
                            </CartDescription>
                        )}
                    </HeadingContents>
                    {products.length === 0 ? (
                        <p>장바구니에 담은 상품이 없습니다.</p>
                    ) : (
                        <>
                            <CartItems
                                products={products}
                                quantityStatus={quantityStatus}
                                checkStatus={checkStatus}
                                isAllChecked={isAllChecked}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                onToggle={handleToggle}
                                onToggleAll={handleToggleAll}
                                onDelete={remove}
                            />
                            <OrderInfoSection>
                                {/* TODO DeliveryNotice Component */}
                                <p>
                                    총 주문 금액이 {FREE_DELIVERY_THRESHOLD.toLocaleString()}원 이상일 경우 무료
                                    배송됩니다.
                                </p>
                                <OrderSummary
                                    orderInfos={[
                                        { summaryType: '주문 금액', summaryAmount: payInfo.orderPrice },
                                        { summaryType: '배송비', summaryAmount: payInfo.deliveryFee },
                                    ]}
                                />
                            </OrderInfoSection>
                        </>
                    )}
                </>
            )}
        </PageLayout>
    );
}

const HeadingContents = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 36px 0;
`;

const Heading = styled.h3`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
    margin: 0;
`;

const CartDescription = styled.p`
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    margin: 0;
`;

const OrderInfoSection = styled.section`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
`;
