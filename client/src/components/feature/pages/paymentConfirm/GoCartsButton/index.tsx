import Button from "@/components/common/shared/ui/Button";
import useCartNavigate from "@/hooks/feature/navigate/useCartNavigate";

function GoCartsButton() {
  const { navigate } = useCartNavigate();

  const handleClick = () => navigate();

  return (
    <Button fullWidth onClick={handleClick}>
      장바구니로 돌아가기
    </Button>
  );
}

export default GoCartsButton;
