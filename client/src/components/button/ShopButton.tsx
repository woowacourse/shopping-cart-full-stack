import { useNavigate } from "react-router-dom";

export default function ShopButton() {
  const navigate = useNavigate();
  return (
    <button type="submit" onClick={() => navigate("/")}>
      SHOP
    </button>
  );
}
