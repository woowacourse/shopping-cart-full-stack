import styled from '@emotion/styled';
import type {ReactNode} from 'react';

import {Divider, theme} from '../design-system/index.js';

interface ProductItemLayoutProps {
  header?: ReactNode;
  image: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ProductItemLayout = ({header, image, children, className}: ProductItemLayoutProps) => {
  return (
    <Root className={className}>
      <Divider />
      {header}
      <Content>
        <Image>{image}</Image>
        <Body>{children}</Body>
      </Content>
    </Root>
  );
};

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 24px;
  align-items: center;
`;

const Image = styled.div`
  width: 112px;
  height: 112px;

  & > img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: ${theme.radius[8]};
    background: ${theme.colors.gray100};
    object-fit: cover;
  }
`;

const Body = styled.div`
  min-width: 0;
`;
