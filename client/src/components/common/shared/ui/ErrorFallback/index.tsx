import Button from "@/components/common/shared/ui/Button";
import Spacing from "@/components/common/shared/layout/Spacing";
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
    <ErrorFallbackContainer role="alert">
      <ErrorIcon aria-hidden>!</ErrorIcon>
      <Spacing size={1.5} />
      <ErrorTitle>{title}</ErrorTitle>
      <Spacing size={0.5} />
      <ErrorDescription>{description}</ErrorDescription>
      <Spacing size={2} />
      <ButtonWrapper>
        <Button fullWidth onClick={handleRetry}>
          다시 시도
        </Button>
      </ButtonWrapper>
    </ErrorFallbackContainer>
  );
}

const ErrorFallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 4rem 1.5rem;
  text-align: center;
`;

const ErrorIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: ${COLOR_PALETTE["image-placeholder"]};
  border: 2px solid ${COLOR_PALETTE.border};
  font-size: 1.5rem;
  font-weight: 700;
`;

const ErrorTitle = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

const ErrorDescription = styled.p`
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${COLOR_PALETTE.disabled};
`;

const ButtonWrapper = styled.div`
  width: 12.5rem;
`;
