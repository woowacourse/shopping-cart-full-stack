/** "2026-11-30" → "2026년 11월 30일". 예상 못한 형식이면 원본(방어적). */
export function formatYmd(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
