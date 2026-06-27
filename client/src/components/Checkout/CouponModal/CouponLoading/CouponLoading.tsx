import Spinner from "../../../../commons/Spinner/Spinner";
import { Container } from "./CouponLoading.styles";

const CouponLoading = () => {
  return (
    <Container role="status" aria-label="모달 쿠폰 요청 중">
      <Spinner />
    </Container>
  );
};

export default CouponLoading;
