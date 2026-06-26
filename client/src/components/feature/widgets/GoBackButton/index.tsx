import arrowLeft from "@assets/arrowLeft.svg";
import styled from "@emotion/styled";
import useGoBackNavigate from "@hooks/feature/navigate/useGoBackNavigate";

export default function GoBackButton() {
  const { navigate: goBack } = useGoBackNavigate();

  return (
    <ButtonContainer onClick={goBack}>
      <ArrowLeftIcon src={arrowLeft} alt="뒤로가기" />
    </ButtonContainer>
  );
}

const ButtonContainer = styled.button`
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ArrowLeftIcon = styled.img``;
