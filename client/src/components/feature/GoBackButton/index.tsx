import useGoBackNavigate from "@/hooks/useGoBackNavigate";
import arrowLeft from "@assets/arrowLeft.svg";
import Flex from "@components/common/shared/Flex";
import styled from "@emotion/styled";

export default function GoBackButton() {
  const { navigate: goBack } = useGoBackNavigate();

  return (
    <ButtonContainer onClick={goBack} align="center" justify="center">
      <ArrowLeftIcon src={arrowLeft} alt="뒤로가기" />
    </ButtonContainer>
  );
}

const ButtonContainer = styled(Flex.withComponent('button'))`
  width: 1.8rem;
  height: 1.8rem;
`;

const ArrowLeftIcon = styled.img``;
