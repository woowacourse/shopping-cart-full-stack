// ISO 문자열 -> "2026년 7월 31일"
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });

// "HH:MM" -> "오전/오후 N시" (분이 있으면 "N시 M분")
export const formatHour = (time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${period} ${hour12}시` : `${period} ${hour12}시 ${minute}분`;
};
