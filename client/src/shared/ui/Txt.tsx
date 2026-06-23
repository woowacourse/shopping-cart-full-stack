import type { ReactNode } from 'react';
import { colors, typography } from '../styles/theme';
import type { CSSObject } from '@emotion/react';

const font = {
  header: {
    ...typography.header,
    verticalAlign: 'center',
  },
  title: {
    ...typography.title,
  },
  label: {
    ...typography.label,
  },
  button: {
    ...typography.button,
  },
  info: {
    ...typography.info,
  },
  modal: {
    ...typography.modal,
  },
  coupon: {
    ...typography.coupon,
  },
};

export default function Txt({
  variant,
  color,
  styles,
  children,
}: {
  variant: keyof typeof typography;
  color: keyof typeof colors;
  styles?: CSSObject;
  children: ReactNode;
}) {
  return (
    <p css={{ ...font[variant], color: colors[color], ...styles }}>
      {children}
    </p>
  );
}
