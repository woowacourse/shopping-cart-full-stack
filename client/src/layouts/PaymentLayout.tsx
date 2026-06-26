import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

export default function PaymentLayout() {
  return (
    <>
      <AppHeader slot={null} />
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
  overflow: auto;
`;
