export const formatNumber = (value: number): string => {
  return value.toLocaleString("ko-KR");
};

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");

  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};
