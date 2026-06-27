import Button from "@components/common/shared/Button";
import Flex from "@components/common/shared/Flex";
import Spacing from "@components/common/shared/Spacing";
import Text from "@components/common/shared/Text";
import styled from "@emotion/styled";
import { COLOR_PALETTE } from "@styles/colorPalette";

interface ErrorFallbackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  title = "문제가 발생했습니다.",
  description = "잠시 후 다시 시도해 주세요.",
  onRetry,
}: ErrorFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
      return;
    }

    window.location.reload();
  };

  return (
    <ErrorFallbackContainer role="alert" direction="column" align="center" justify="center">
      <ErrorIcon aria-hidden align="center" justify="center">!</ErrorIcon>
      <Spacing size={1.5} />
      <Text typograph="heading2" as="h2">
        {title}
      </Text>
      <Spacing size={0.5} />
      <Text typograph="body2" as="p" color="disabled">
        {description}
      </Text>
      <Spacing size={2} />
      <ButtonWrapper>
        <Button fullWidth onClick={handleRetry}>
          다시 시도
        </Button>
      </ButtonWrapper>
    </ErrorFallbackContainer>
  );
}

const ErrorFallbackContainer = styled(Flex)`
  flex: 1;
  padding: 4rem 1.5rem;
  text-align: center;
`;

const ErrorIcon = styled(Flex)`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${COLOR_PALETTE["image-placeholder"]};
  border: 2px solid ${COLOR_PALETTE.border};
  font-size: 1.5rem;
  font-weight: 700;
`;

const ButtonWrapper = styled.div`
  width: 12.5rem;
`;
