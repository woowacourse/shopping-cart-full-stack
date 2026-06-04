import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="submit" onClick={() => navigate(-1)}>
      <img src="/backBtn.png" />
    </button>
  );
}
