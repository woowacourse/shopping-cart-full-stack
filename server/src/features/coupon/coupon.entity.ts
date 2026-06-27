export interface CouponEntity {
  id: string; // 아이디
  name: string; // 이름
  expiriation_date: Date; // 만료일

  rule_type: "LOW_PRICE" | "TIME" | null;
  limit_price: number | null; // 최소금액
  start_time: string | null; // 시간타입 문자열 "HH:MM"
  end_time: string | null;

  discount_type: "FIXED" | "BOGO" | "FREESHIPPING" | "MIRACLESALE"; // 어떻게 타입시스템으로만들지
  discount_fixed: number | null; // 할인금액
  discount_rate: number | null; // 할인 퍼센트
}
