import useModal from "../../../../hooks/useModal";
import CouponModal from "../CouponModal";
import { Container, StyledButton } from "./CouponButton.styles";

interface Props {
  refetch: () => Promise<void>;
}

const CouponButton = ({ refetch }: Props) => {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Container>
        <StyledButton type="button" onClick={openModal}>
          쿠폰 적용
        </StyledButton>
      </Container>
      {isOpen && <CouponModal onClose={closeModal} refetch={refetch} />}
    </>
  );
};

export default CouponButton;
