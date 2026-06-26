import styled from '@emotion/styled';

import {Checkbox, fontWeights, theme, typography} from '../../../../design-system/index.js';

interface OrderPreviewShippingSectionProps {
  isRemoteArea: boolean;
  onChangeRemoteArea: (isRemoteArea: boolean) => void;
}

export const OrderPreviewShippingSection = ({isRemoteArea, onChangeRemoteArea}: OrderPreviewShippingSectionProps) => {
  return (
    <ShippingSection>
      <SectionTitle>배송 정보</SectionTitle>
      <Checkbox
        checked={isRemoteArea}
        label='제주도 및 도서 산간 지역'
        onChange={(event) => onChangeRemoteArea(event.currentTarget.checked)}
      />
    </ShippingSection>
  );
};

const ShippingSection = styled.section`
  margin-top: 32px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
`;
