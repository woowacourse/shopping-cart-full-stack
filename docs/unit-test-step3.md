# 테스트

- 안정적인 소프트웨어를 만들기 위해서, 자동화 테스트 범위(E2E, 단위, 통합)와 대상을 스스로 정의하고, 테스트 한다. 테스트 대상 선정 이유를 PR 에 남긴다.

## 단위 테스트

### 쿠폰

```ts
interface Coupon {
  id: string; // 아이디
  name: string; // 이름
  description: string; // 설명
  expiriation_date: string; // 만료일
  canUse: (args: CouponProps) => Promise<boolean>; // 사용할 수 있는지
  execute: (args: CouponProps) => Promise<Summary>; // 쿠폰 사용
}
```

```ts
interface CouponProps {
  checkedCart: Cart[];
  orderTime: Date;
  hard_delivery_price: boolean;
}
```

```ts
// excute 반환타입상태
interface Summary {
  orderPrice: number;
  dicountPrice: number;
  deliveryPrice: number;
  totalPrice: number;
}
```

```ts
// 반환타입상태
interface CouponStatus {
  type: "USABLE" | "UNUSABLE"; // 사용 가능한지
  message: string | null; // unusable일때 실패메세지
  apply: false; // 적용 여부
}
```

### 1- FIXED5000

canUse() 테스트

실패

1. 최소 주문 금액을 못 맞췄을 때 false를 반환한다
2. 만료일이 지났을 때 false 를 반환한다.

성공

1. 최소 주문 금액을 맞췄을 떄 true 를 반환한다.

execute() 테스트

성공

1. 할인금액에 대해 정해진 금액(5000)만큼 할인을 한다

### 2- BOGO

canUse() 테스트

- 실패

1. 동일 상품이 한 개일때 false를 반환한다.
2. 만료일이 지났을 때 false 를 반환한다.

execute() 테스트

1. 쿠폰 적용 시 금액 그대로 반환한다

### 3- FREESHIPPING

canUse() 테스트

- 실패

1. 최소 주문 금액 50,000원되지 않는다면 false를 반환한다.
2. 만료일이 지났을 때 false 를 반환한다.

execute() 테스트

1. 할인금액에 대해 정해진 금액(배송비)만큼 할인을 한다
2. 산간 지역의 경우 배송비가 산간지역만큼 증가해서 할인을 한다.

### 4- MIRACLESALE

canUse() 테스트

- 실패

1. 오전 3시의 경우 실패를 반환한다.

execute() 테스트

1. 5시의 경우 30%를 할인해준다.
