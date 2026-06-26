import styled from '@emotion/styled';
import CheckBox from './CheckBox';
import type { Coupon } from './CouponCheckModal';
import type { CouponDescription } from '../api/apiTypes';

// TODO 서버에서 string으로 형변환해서 주면 이 포맷팅 함수도 불필요
const formatDescription = (desc: CouponDescription): string => {
    switch (desc.type) {
        case 'EXPIRY_DATE': {
            const [year, month, day] = desc.content.expiresAt.split('-');
            return `만료일: ${year}년 ${Number(month)}월 ${Number(day)}일`;
        }
        case 'MIN_ORDER_AMOUNT':
            return `최소 주문 금액: ${desc.content.minAmount.toLocaleString()}원`;
        case 'USABLE_TIME': {
            const fmtFrom = (t: string) => {
                const h = Number(t.split(':')[0]);
                return `${h < 12 ? '오전' : '오후'} ${h === 0 ? 12 : h > 12 ? h - 12 : h}시`;
            };
            const fmtTo = (t: string) => {
                const h = Number(t.split(':')[0]);
                return `${h === 0 ? 12 : h > 12 ? h - 12 : h}시`;
            };
            return `사용 가능 시간: ${fmtFrom(desc.content.from)}부터 ${fmtTo(desc.content.to)}까지`;
        }
        case 'MIN_QUANTITY_PER_PRODUCT':
            return `동일 상품 ${desc.content.minQuantity}개 이상 구매 시`;
    }
};

interface CouponItemProps {
    coupon: Coupon;
    checked: boolean;
    disabled: boolean;
    onClick: () => void;
}

export default function CouponItem({ coupon, checked, disabled, onClick }: CouponItemProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <CouponItemContainer
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={disabled ? undefined : handleKeyDown}
        >
            <TitleRow>
                <CheckBox checked={checked} disabled={disabled} />
                <CouponTitle>{coupon.couponTitle}</CouponTitle>
            </TitleRow>
            <DescriptionList>
                {coupon.description.map((desc, i) => (
                    <DescriptionItem key={i}>{formatDescription(desc)}</DescriptionItem>
                ))}
            </DescriptionList>
        </CouponItemContainer>
    );
}

const CouponItemContainer = styled.li<{ disabled: boolean }>`
    padding: 24px 0;
    border-bottom: 1px solid #0000001a;
    opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
`;

const CouponTitle = styled.p`
    margin: 0;
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
`;

const DescriptionList = styled.ul`
    margin: 0;
    padding: 0 0 0 36px;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const DescriptionItem = styled.li`
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    color: #333333;
`;
