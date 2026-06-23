import Header from '../../shared/ui/Header';
import { BottomButton } from '../../shared/ui/Button';
import OrderCheck from './ui/OrderCheck';
import { colors } from '../../shared/styles/theme';
import { useNavigate } from 'react-router-dom';
import Flex from '../../shared/layout/Flex';

export default function CheckoutPage() {
  const navigate = useNavigate();

  return (
    <Flex
      direction="column"
      align="center"
      styles={{
        backgroundColor: colors.white,
        width: '430px',
        height: '100vh',
        margin: '0 auto',
      }}
    >
      <Header />
      <OrderCheck />
      <BottomButton onClick={() => navigate('/')}>
        장바구니로 돌아가기
      </BottomButton>
    </Flex>
  );
}
