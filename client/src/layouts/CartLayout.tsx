import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function CartLayout() {
  return (
    <>
      <AppHeader slot={<Title>SHOP</Title>} />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100% - 128px);
  padding: 36px 24px 64px 24px;
  overflow: auto;
`;

const Title = styled.strong`
  font-size: 20px;
  font-weight: 800;
  color: #fff;
`;
