export const formatPrice = (price: number) => price.toLocaleString("ko-KR") + "원";

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

const formatTime = (time: string, options: { showMeridiem?: boolean } = {}) => {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const period = hour < 12 ? "오전" : "오후";
  const hour12 = hour % 12 || 12;
  const minutePart = minute === 0 ? "" : ` ${minute}분`;
  const meridiemPart = options.showMeridiem === false ? "" : `${period} `;

  return `${meridiemPart}${hour12}시${minutePart}`;
};

export const formatTimeRange = (startTime: string, endTime: string) => {
  const [startHourText] = startTime.split(":");
  const [endHourText] = endTime.split(":");
  const startHour = Number(startHourText);
  const endHour = Number(endHourText);
  const isSamePeriod = startHour < 12 === endHour < 12;

  return `${formatTime(startTime)}부터 ${formatTime(endTime, { showMeridiem: !isSamePeriod })}까지`;
};
