import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <Container>
      <Main>
        <Outlet />
      </Main>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Main = styled.main`
  min-width: 430px;
  max-width: 1280px;
  width: 100%;
  height: 100%;
  background-color: #f4f5e8;
`;
