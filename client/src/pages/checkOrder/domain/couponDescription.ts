import type { Coupon } from "../types";

function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return `${year}년 ${month}월 ${day}일`;
}

function formatTime(time: string): string {
  const hour = Number(time.split(":")[0]);
  const meridiem = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${meridiem} ${displayHour}시`;
}

export function getCouponDescriptions(coupon: Coupon): string[] {
  const descriptions = [`만료일: ${formatDate(coupon.expiryDate)}`];

  if (coupon.minAmount !== null) {
    descriptions.push(`최소 주문 금액: ${coupon.minAmount.toLocaleString()}원`);
  }

  if (coupon.startTime !== null && coupon.endTime !== null) {
    descriptions.push(
      `사용 가능 시간: ${formatTime(coupon.startTime)}부터 ${formatTime(coupon.endTime)}까지`,
    );
  }

  return descriptions;
}
