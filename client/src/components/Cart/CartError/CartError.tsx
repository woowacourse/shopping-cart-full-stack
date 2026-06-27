import { Container, Message } from "./CartError.styles";

interface Props {
  error: string;
}

const CartError = ({ error }: Props) => {
  return (
    <Container>
      <Message>{error}</Message>
    </Container>
  );
};

export default CartError;
