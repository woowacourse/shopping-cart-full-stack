export function formatDueDate(dueDate: string): string {
  const [year, month, day] = dueDate.split('-').map(Number);

  return `${year}년 ${month}월 ${day}일`;
}
