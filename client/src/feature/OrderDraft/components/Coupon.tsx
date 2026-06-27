import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Checkbox } from '../../../shared/styles/common';

export const CouponRoot = ({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled: boolean;
}) => {
  return <Section $disabled={disabled}>{children}</Section>;
};

const Section = styled.div<{ $disabled: boolean }>`
  display: grid;
  grid-template-columns: 22px 1fr;
  grid-template-areas:
    'checkbox name'
    '. expiration'
    '. description';
  column-gap: 12px;
  row-gap: 6px;

  padding: 20px 0;
  border-bottom: 1px solid #eeeeee;

  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`;

const CouponCheckbox = styled(Checkbox)`
  grid-area: checkbox;
`;

const CouponName = styled.strong`
  grid-area: name;

  font-size: 17px;
  font-weight: 800;
`;

const CouponExpiration = styled.span`
  grid-area: expiration;
  grid-column: 1 / -1;

  font-size: 13px;
  font-weight: 600;
`;

const CouponDescription = styled.span`
  grid-area: description;
  grid-column: 1 / -1;

  font-size: 13px;
  font-weight: 600;
`;

export const Coupon = Object.assign(CouponRoot, {
  Checkbox: CouponCheckbox,
  Name: CouponName,
  Expiration: CouponExpiration,
  Description: CouponDescription,
});
