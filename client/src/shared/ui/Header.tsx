import type { ReactNode } from 'react';

import { colors } from '../styles/theme';
import Flex from '../layout/Flex';

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <Flex
      as="header"
      align="center"
      styles={{
        backgroundColor: colors.black,
        height: '64px',
        flexShrink: 0,
        width: '100%',
        padding: '0 24px',
      }}
    >
      {children}
    </Flex>
  );
}
