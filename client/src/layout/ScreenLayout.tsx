import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {theme} from '../design-system/index.js';

interface ScreenLayoutProps {
  header: ReactNode;
  children: ReactNode;
  bottomButton: ReactNode;
}

export const ScreenLayout = ({header, children, bottomButton}: ScreenLayoutProps) => {
  return (
    <>
      <Header>{header}</Header>
      <ContentContainer>{children}</ContentContainer>
      <BottomContainer>{bottomButton}</BottomContainer>
    </>
  );
};

const Header = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  display: flex;
  width: 100%;
  min-height: 64px;
  max-width: 430px;
  align-items: center;
  margin: 0 auto;
  padding: 0 24px;
  background: ${theme.colors.black};
`;

const ContentContainer = styled.main`
  display: flex;
  min-height: 100dvh;
  box-sizing: border-box;
  flex-direction: column;
  padding: calc(64px + 36px) 24px calc(64px + 32px);
`;

const BottomContainer = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 64px;
  max-width: 430px;
  margin: 0 auto;
  background: ${theme.colors.white};

  & > button {
    width: 100%;
  }
`;
