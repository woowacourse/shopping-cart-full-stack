import styled from '@emotion/styled';
import CheckBox from './CheckBox';
import ItemActionButton from './ItemActionButton';
import ItemCardLayout from './ItemCardLayout';
import ItemCardStyle from './ItemCardStyle';
import type { Product } from '../api/apiTypes';
import QuantitySlot from './QuantitySlot';

interface ItemCardProps {
    checkStatus: boolean;
    handleCheckboxClick: () => void;
    quantity: number;
    handleQuantityPlusClick: () => void;
    handleQuantityMinusClick: () => void;
    product: Product;
    handleDeleteClick: () => void;
}

export default function ItemCard({
    checkStatus,
    handleCheckboxClick,
    quantity,
    handleQuantityPlusClick,
    handleQuantityMinusClick,
    product,
    handleDeleteClick,
}: ItemCardProps) {
    return (
        <ItemCardStyle>
            <CheckDeleteArea>
                <CheckBox checked={checkStatus} onClick={handleCheckboxClick} />
                <ItemActionButton onClick={handleDeleteClick} text="삭제" />
            </CheckDeleteArea>
            <ItemCardLayout
                product={product}
                quantityArea={
                    <QuantitySlot>
                        <ItemActionButton onClick={handleQuantityMinusClick} text="-" disabled={quantity <= 0} />
                        <Quantity>{quantity}</Quantity>
                        <ItemActionButton onClick={handleQuantityPlusClick} text="+" disabled={quantity >= 99} />
                    </QuantitySlot>
                }
            />
        </ItemCardStyle>
    );
}

const CheckDeleteArea = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

const Quantity = styled.p`
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0%;
`;
