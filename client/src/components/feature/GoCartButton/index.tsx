import PositionBottom from "@components/common/shared/PositionBottom";
import Button from "@components/common/shared/Button";
import useCartsNavigate from "@hooks/useCartsNavigate.ts";

export default function GoCartButton() {
  const { navigate } = useCartsNavigate();

  return (
    <PositionBottom>
      <Button fullWidth onClick={() => navigate()}>장바구니로 돌아가기</Button>
    </PositionBottom>
  );
}
