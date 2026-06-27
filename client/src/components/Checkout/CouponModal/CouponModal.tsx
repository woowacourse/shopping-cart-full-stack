import CouponModalContent from "./CouponModalContent/CouponModalContent";
import { Background, Header, ModalContainer } from "./CouponModal.styles";
import CouponError from "./CouponError/CouponError";
import CouponLoading from "./CouponLoading/CouponLoading";
import useCouponData from "../../../hooks/useCouponData";
import closeIcon from "../../../assets/close-icon.png";

interface Props {
  onClose: () => void;
  refetch: () => Promise<void>;
}

const CouponModal = ({ onClose, refetch }: Props) => {
  const { data, loading, error } = useCouponData();

  return (
    <Background>
      <ModalContainer>
        <Header>
          <p>쿠폰을 선택해 주세요</p>
          <button onClick={onClose}>
            <img src={closeIcon} alt="" />
          </button>
        </Header>
        {loading && <CouponLoading />}
        {error && <CouponError />}
        {!loading && !error && data && (
          <CouponModalContent data={data} onClose={onClose} refetch={refetch} />
        )}
      </ModalContainer>
    </Background>
  );
};

export default CouponModal;
