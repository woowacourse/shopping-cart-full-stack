import Spinner from "../Spinner/Spinner";
import { Container } from "./UpdatingOverlay.styles";

interface Props {
  ariaLabel?: string;
}

const UpdatingOverlay = ({ ariaLabel = "처리 중" }: Props) => {
  return (
    <Container role="status" aria-label={ariaLabel}>
      <Spinner />
    </Container>
  );
};

export default UpdatingOverlay;
