import styled from '@emotion/styled';
import type { ReactNode } from 'react';

export default function AppHeader({ slot }: { slot: ReactNode }) {
  return <Container>{slot}</Container>;
}

const Container = styled.header`
  display: flex;
  align-items: center;
  padding-left: 24px;
  width: 100%;
  min-height: 64px;
  background-color: #000000;
`;
