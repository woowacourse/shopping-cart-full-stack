import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import type { Product } from '../api/apiTypes';

interface ItemCardLayoutProps {
    product: Product;
    quantityArea: ReactNode;
}

export default function ItemCardLayout({ product, quantityArea }: ItemCardLayoutProps) {
    return (
        <ItemInfoArea>
            <ItemImage src={product.imgUrl} />
            <ItemDetailInfo>
                <>
                    <ItemName>{product.name}</ItemName>
                    <ItemPrice>{product.price.toLocaleString()}원</ItemPrice>
                </>
                {quantityArea}
            </ItemDetailInfo>
        </ItemInfoArea>
    );
}

const ItemInfoArea = styled.div`
    width: 100%;
    height: 112px;
    display: flex;
    gap: 24px;
`;

const ItemImage = styled.img`
    width: 112px;
    height: 112px;
    border-radius: 8px;
`;

const ItemDetailInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
`;

const ItemName = styled.p`
    margin: 0;
    font-weight: 500;
    font-size: 12px;
    color: #0a0d13;
    line-height: 15px;
`;

const ItemPrice = styled.p`
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
`;
