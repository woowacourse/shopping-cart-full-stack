import type { AvailableTime } from '../types/coupon.types';

export const formatDueDate = (dueDate: string) => {
  const [year, month, day] = dueDate.split('-').map(Number);
  return `${year}년 ${month}월 ${day}일`;
};

const formatHour = (time: string) => {
  const hour = Number(time.split(':')[0]);
  const meridiem = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${meridiem} ${hour12}시`;
};

export const formatAvailableTime = ({ startTime, endTime }: AvailableTime) => {
  if (!startTime || !endTime) return '';
  return `${formatHour(startTime)}부터 ${formatHour(endTime).replace(/^오[전후] /, '')}까지`;
};
