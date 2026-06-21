import styled from '@emotion/styled';

import {Checkbox, Typo, fontWeights, theme, typography} from '../../../design-system/index.js';
import type {Coupon} from '../../coupon/domain/types.js';

interface CouponModalItemProps {
  checked: boolean;
  coupon: Coupon;
  disabled: boolean;
  onChange: () => void;
}

export const CouponModalItem = ({checked, coupon, disabled, onChange}: CouponModalItemProps) => {
  return (
    <Root>
      <Content>
        <CheckboxArea disabled={disabled}>
          <Checkbox
            checked={checked}
            disabled={disabled}
            label={<CouponName disabled={disabled}>{coupon.name}</CouponName>}
            onChange={onChange}
          />
        </CheckboxArea>
        <DescriptionList disabled={disabled}>
          <CouponDescription as='p' variant='caption' weight='medium'>
            만료일: {formatDate(coupon.expirationDate)}
          </CouponDescription>
          <ConditionDescription as='p' $hidden={!coupon.condition.description} variant='caption' weight='medium'>
            {coupon.condition.description ?? ''}
          </ConditionDescription>
        </DescriptionList>
      </Content>
    </Root>
  );
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ko-KR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const Root = styled.li`
  padding: 16px 0;
  border-top: 1px solid ${theme.colors.gray100};
`;

const Content = styled.div``;

const CheckboxArea = styled.div<{disabled: boolean}>`
  pointer-events: ${({disabled}) => (disabled ? 'none' : 'auto')};
`;

const DescriptionList = styled.div<{disabled: boolean}>`
  opacity: ${({disabled}) => (disabled ? 0.35 : 1)};
  pointer-events: ${({disabled}) => (disabled ? 'none' : 'auto')};
`;

const CouponName = styled.span<{disabled: boolean}>`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};
  opacity: ${({disabled}) => (disabled ? 0.35 : 1)};
`;

const CouponDescription = styled(Typo)`
  margin: 8px 0 0;
`;

const ConditionDescription = styled(CouponDescription)<{$hidden: boolean}>`
  visibility: ${({$hidden}) => ($hidden ? 'hidden' : 'visible')};
`;
