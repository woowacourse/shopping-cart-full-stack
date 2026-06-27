# 장바구니 4단계 구현 목록

## 장바구니 페이지 (`/cart`)

### 이벤트

- [x] 주문 확인 버튼 클릭 -> `POST /orders` 호출 후 `/checkout/:orderId`로 이동
  - request: `{ products: [{ id, quantity }] }`
  - response: `{ status: "success", data: { orderId: number } }`
  - 에러: 재고 부족(`OUT_OF_STOCK`) / 상품 없음(`NOT_EXIST_PRODUCT`) -> 알림 표시

---

## 주문 확인 페이지 (`/checkout/:orderId`)

### UI

- [x] 선택한 상품 목록 표시 (상품명, 가격, 수량)
- [x] 쿠폰 적용 버튼
- [x] 배송지 정보 체크박스 (제주도 및 도서 산간 지역 여부)
- [x] 주문 금액 / 쿠폰 할인 금액 / 배송비 / 총 결제 금액 표시

### 이벤트

- [x] 페이지 진입 시 주문 정보 조회 `GET /orders/:orderId`
  - response: `{ status: "success", data: { products, coupons, isRemoteArea, deliveryFee } }`
- [x] 배송지 체크박스 변경 -> `PATCH /orders/:orderId` 호출
  - request: `{ type: "shipping", isRemoteArea: boolean }`
  - response: `{ status: "success", data: { isRemoteArea, deliveryFee } }`
  - 체크박스 상태는 낙관적 업데이트, 배송비는 서버 응답값으로 업데이트
- [x] 쿠폰 적용 버튼 클릭 -> 쿠폰 목록 조회 후 쿠폰 선택 모달 오픈
- [x] 결제하기 버튼 클릭 -> `POST /payments` 호출 후 결제 금액 확인 페이지로 이동
  - request: `{ orderId: number, amount: number }`
  - response: `{ status: "success", data: { finalAmount: number } }`
  - 에러 `PAYMENT_AMOUNT_MISMATCH`: 알림 표시 후 `/cart`로 리다이렉트
  - 에러 `EXPIRED_COUPON`: 만료 쿠폰 알림 표시 -> 확인 클릭 시 `GET /orders/:orderId` 재조회 -> FE에서 할인 금액 재계산 -> 화면 업데이트

---

## 쿠폰 선택 모달

### UI

- [x] 쿠폰 목록 표시 (쿠폰명, 만료일, 최소 주문 금액 등 부가 정보)
- [x] 사용 불가 쿠폰 비활성화 처리 (선택 불가, 사유 표시)
- [x] 최대 2개까지만 선택 가능하도록 제한
- [x] 선택한 쿠폰의 할인 금액 표시
- [x] 쿠폰 사용하기 버튼 / 닫기(X) 버튼

### 이벤트

- [x] 모달 오픈 시 쿠폰 목록 조회 `GET /orders/:orderId/coupons`
  - response: `{ status: "success", data: [{ ...coupon, isCouponUsable: boolean }] }`
- [x] 쿠폰 선택/해제 -> 최대 2개 초과 시 추가 선택 불가 처리
- [x] 쿠폰 사용하기 버튼 클릭 -> `PATCH /orders/:orderId` 호출
  - request: `{ type: "coupon", couponIds: number[] }`
  - response: `{ status: "success", data: { couponIds, hasGift: boolean } }`
  - 성공 시 모달 닫고 주문 확인 페이지 쿠폰 할인 금액 업데이트(할인 금액을 바탕으로 총 결제 금액도 함께 업데이트)

---

## 결제 금액 확인 페이지

### UI

- [x] 총 결제 금액 표시
- [x] 장바구니로 돌아가기 버튼 -> `/cart`로 이동

---

## 라우팅 추가

- [x] `/checkout/:orderId` 라우트 추가 (현재 `/checkout` 고정)
- [x] 결제 완료 페이지 라우트 추가
