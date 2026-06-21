import styled from '@emotion/styled';

import {fontWeights, theme, typography} from '../../../../design-system/index.js';
import {ProductItemLayout} from '../../../../shared/layout/ProductItemLayout.js';
import type {PreorderItem} from '../../../preorder/domain/types.js';

interface OrderPreviewProductListProps {
  items: PreorderItem[];
}

export const OrderPreviewProductList = ({items}: OrderPreviewProductListProps) => {
  return (
    <PreviewProductList>
      {items.map((item) => (
        <PreviewProductItem key={item.productId} item={item} />
      ))}
    </PreviewProductList>
  );
};

interface PreviewProductItemProps {
  item: PreorderItem;
}

const PreviewProductItem = ({item}: PreviewProductItemProps) => {
  return (
    <PreviewProductItemRoot image={<img alt={item.name} src={item.imageUrl} />}>
      <ProductInfo>
        <ProductName>{item.name}</ProductName>
        <ProductPrice>{item.price.toLocaleString('ko-KR')}원</ProductPrice>
        <ProductQuantity>{item.quantity}개</ProductQuantity>
      </ProductInfo>
    </PreviewProductItemRoot>
  );
};

const PreviewProductList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 36px;
`;

const PreviewProductItemRoot = styled(ProductItemLayout)`
  padding-bottom: 20px;
`;

const ProductInfo = styled.div`
  display: flex;
  min-width: 0;
  height: 112px;
  flex-direction: column;
  justify-content: center;
`;

const ProductName = styled.strong`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.caption.lineHeight};
`;

const ProductPrice = styled.strong`
  margin-top: 8px;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
`;

const ProductQuantity = styled.span`
  margin-top: 28px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
`;
