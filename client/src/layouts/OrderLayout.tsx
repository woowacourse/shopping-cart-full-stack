import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';
import AppHeader from './AppHeader';
import backwardIcon from '../assets/backward.svg';

export default function OrderLayout() {
  const navigate = useNavigate();

  return (
    <>
      <AppHeader
        slot={
          <BackwardButton onClick={() => navigate(-1)}>
            <img src={backwardIcon} alt="backwrad-icon" />
          </BackwardButton>
        }
      />
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

const BackwardButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
`;
