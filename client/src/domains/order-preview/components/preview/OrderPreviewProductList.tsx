import styled from '@emotion/styled';

import {fontWeights, theme, typography} from '../../../../design-system/index.js';
import {ProductItemLayout} from '../../../../shared/layout/ProductItemLayout.js';
import type {PreorderItem} from '../../../preorder/domain/types.js';
import type {BenefitItem} from '../../domain/types.js';

interface OrderPreviewProductListProps {
  benefitItems: BenefitItem[];
  items: PreorderItem[];
}

export const OrderPreviewProductList = ({benefitItems, items}: OrderPreviewProductListProps) => {
  return (
    <PreviewProductList>
      {items.map((item) => {
        const benefitQuantity = getBenefitQuantity(item.productId, benefitItems);

        return <PreviewProductItem key={item.productId} benefitQuantity={benefitQuantity} item={item} />;
      })}
    </PreviewProductList>
  );
};

interface PreviewProductItemProps {
  benefitQuantity: number;
  item: PreorderItem;
}

const PreviewProductItem = ({benefitQuantity, item}: PreviewProductItemProps) => {
  return (
    <PreviewProductItemRoot image={<img alt={item.name} src={item.imageUrl} />}>
      <ProductInfo>
        <ProductName>{item.name}</ProductName>
        <ProductPrice>{item.price.toLocaleString('ko-KR')}원</ProductPrice>
        <ProductQuantity>{item.quantity}개</ProductQuantity>
        {benefitQuantity > 0 && <BenefitQuantity>+ {benefitQuantity}개 무료</BenefitQuantity>}
      </ProductInfo>
    </PreviewProductItemRoot>
  );
};

const getBenefitQuantity = (productId: string, benefitItems: BenefitItem[]) => {
  return benefitItems
    .filter((benefitItem) => benefitItem.productId === productId)
    .reduce((totalQuantity, benefitItem) => totalQuantity + benefitItem.quantity, 0);
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
  margin-top: 16px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
`;

const BenefitQuantity = styled.span`
  margin-top: 4px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.caption.lineHeight};
`;
