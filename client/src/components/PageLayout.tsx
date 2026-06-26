import type { ReactNode } from 'react';
import styled from '@emotion/styled';

interface PageLayoutProps {
  headerContent?: ReactNode;
  children: ReactNode;
}

const PageLayout = ({ headerContent, children }: PageLayoutProps) => {
  return (
    <PageWrapper>
      <Header>
        <HeaderContent>{headerContent}</HeaderContent>
      </Header>

      <Main>{children}</Main>
    </PageWrapper>
  );
};

const PageWrapper = styled.div`
  max-width: 26rem;
  min-height: 100vh;
  margin-inline: auto;
`;

const Header = styled.header`
  height: 4rem;
  background-color: #000000;
`;

const HeaderContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-inline: 1rem;
`;

const Main = styled.main`
  padding: 2.25rem 1.5rem 6.25rem;
`;

export default PageLayout;
