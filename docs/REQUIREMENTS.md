# REQUIREMENTS

## 🎯 기능 요구사항

아래 기능 요구사항을 바탕으로 REST API를 직접 설계하고 구현합니다.

- [x] endpoint, HTTP 메서드, 응답 형식, 에러 코드를 스스로 결정한다.
- [x] 주문, 총 결제 금액 계산 기능은 구현하지 않는다.

### 상품

- [x] 상품 목록을 조회할 수 있다.
- [x] 상품을 추가할 수 있다.
- [x] 상품을 삭제할 수 있다.
- [x] 삭제된 상품이 장바구니에 있으면 함께 제거한다.

### 장바구니

- [x] 장바구니에 담긴 상품 목록을 조회할 수 있다.
- [x] 장바구니 상품의 수량을 변경할 수 있다.
- [x] 장바구니에 담긴 상품을 제거할 수 있다.

## ✅ 프로그래밍 요구사항

### API 설계

- [x] endpoint와 HTTP 메서드를 REST 원칙에 맞게 설계한다.
- [x] HTTP 상태 코드(200, 204, 201, 400, 404, 500 등) 사용 기준을 정하고 그 이유를 설명한다.

### 서버

- [x] Node.js + Express 사용
- [x] TypeScript로 구현
- [x] 데이터는 DB가 아닌 in-memory(배열 또는 Map)로 관리
- [x] HTTP 상태 코드를 의미에 맞게 사용한다 (200, 201, 204, 400, 404 등)
- [x] FE와 연동을 위한 CORS 설정

### 테스트

- [x] 도메인 로직과 API 요청을 테스트
- [x] 도메인은 Jest, API 호출은 Supertest 활용
- [ ] TDD로 구현

### 검증

- [x] 필수 필드 누락 시 에러 응답
- [x] 존재하지 않는 상품/장바구니 아이템 요청 시 에러 응답
- [x] quantity는 1 이상 99 이하의 정수
- [x] price는 0보다 큰 숫자
- [x] 상품명은 최대 100자

### 문서화

- [x] 요구사항 문서를 `docs/REQUIREMENTS.md`에 작성
- [x] `docs/api.md`에 API 명세 작성

### 배포

- [x] Railway에 배포

# Step3

# 요구사항 명세서

```
selectedItemIds: [1, 2, 3, ...], // 장바구니 선택된 id 배열
coupons: [], // 쿠폰 id 배열
isRemoteArea: false // 제주 및 도서산간지역 체크 유무
```

```
orderAmount: ..., // 주문금액
couponDiscount: ..., // 쿠폰할인금액
deliveryFee: ..., // 배송비
totalPrice: ..., // 총 결제금액
appliedCoupons: [...], // 적용된 쿠폰 id 배열
```

## 주문 확인 전 (장바구니 페이지)

- 첫페이지 진입시/장바구니에서 주문할 상품 선택 및 수량 변경 시
  - FE -> BE로
    ```
    requestBody: {
    selectedItemIds: [1, 2, 3, ...],
    coupons: [],
    isRemoteArea: false
    }
    ```
  - selectecdItemIds에 있는 id(CartItem 테이블의 primary key)를 대조해서 CartItem의 해당 row에 있는 productId(FK)와 Prouct 테이블의 id(PK)로 JOIN해서 price, quantity 접근
  - DB -> BE
    - price, quantity 가져오기
  - BE
    - 가져온 price, quantity로 주문금액, 쿠폰할인금액, 배송비, 총결제금액, 적용한 쿠폰 반환
  - BE -> FE
    ```
    responseBody: {
      orderAmount: ...,
      couponDiscount: ...,
      deliveryFee: ...,
      totalPrice: ...,
      appliedCoupons: [...],
      }
    ```

## 주문 확인 후 (주문확인 페이지)

- 주문확인 페이지 첫 진입시
  - FE -> BE로

  ```
  requestBody: {
    selectedItemIds: [1, 2, 3, ...],
    coupons: [0, 1, 2, 3],
    isRemoteArea: false
    }
  ```

  - BE -> DB
    - selectecdItemIds에 있는 id(CartItem 테이블의 primary key)를 대조해서 CartItem의 해당 row에 있는 productId(FK)와 Prouct 테이블의 id(PK)로 JOIN해서 price, quantity 접근
  - DB -> BE
    - price, quantity 가져오기
  - BE
    - 가져온 price, quantity로 주문금액, 쿠폰할인금액, 배송비, 총결제금액, 적용한 쿠폰 반환
  - BE -> FE
    ```
    responseBody: {
      orderAmount: ...,
      couponDiscount: ...,
      deliveryFee: ...,
      totalPrice: ...,
      appliedCoupons: [...],
      }
    ```

- 도서 산간지역 체크시
  - FE -> BE로

    ```
    requestBody: {
    selectedItemIds: [1, 2, 3, ...],
    coupons: [0, 1, 2, 3],
    isRemoteArea: true
    }
    ```

  - BE -> DB
    - selectecdItemIds에 있는 id(CartItem 테이블의 primary key)를 대조해서 CartItem의 해당 row에 있는 productId(FK)와 Prouct 테이블의 id(PK)로 JOIN해서 price, quantity 접근
  - DB -> BE
    - price, quantity 가져오기
  - BE
    - 가져온 price, quantity로 주문금액, 쿠폰할인금액, 배송비, 총결제금액, 적용한 쿠폰 반환
  - BE -> FE
    ```
    responseBody: {
      orderAmount: ...,
      couponDiscount: ...,
      deliveryFee: ...,
      totalPrice: ...,
      appliedCoupons: [...],
      }
    ```

- 쿠폰 적용버튼 클릭 시 쿠폰 적용 모달
  - FE -> BE로
    ```
    requestBody: {
    selectedItemIds: [1, 2, 3, ...],
    // 여기서는 최대 2개의 id를 보낸다.
    coupons: [1, 2],
    isRemoteArea: true
    }
    ```
  - BE -> DB
    - selectecdItemIds에 있는 id(CartItem 테이블의 primary key)를 대조해서 CartItem의 해당 row에 있는 productId(FK)와 Prouct 테이블의 id(PK)로 JOIN해서 price, quantity 접근
  - DB -> BE
    - price, quantity 가져오기
  - BE
    - 가져온 price, quantity로 주문금액, 쿠폰할인금액, 배송비, 총결제금액, 적용한 쿠폰 반환
  - BE -> FE
    ```
    responseBody: {
      orderAmount: ...,
      couponDiscount: ...,
      deliveryFee: ...,
      totalPrice: ...,
      appliedCoupons: [...],
      }
    ```

---

### 기능 구현 목록

#### BE — 쿠폰 도메인

- DB 초기 데이터 세팅
  - `Coupon` 테이블은 **카탈로그만 보관** (id, name, type, expirationDate)
  - 할인 정책(할인액/할인율/최소주문금액/시간대 등)은 DB가 아니라 **`type`별 BE 계산 로직 상수**로 관리
  - 4종 쿠폰 시드 데이터 삽입 (FIXED5000 / BOGO / FREESHIPPING / MIRACLESALE)

- 쿠폰 목록 조회 `GET /coupons`
  - 전체 쿠폰 목록 반환
  - 성공 시 200 OK

- 주문 금액 계산 `POST /order/preview`
  - Request: `{ selectedItemIds, coupons, isRemoteArea }`
  - CartItem JOIN Product으로 price, quantity 조회
  - 주문금액(orderAmount) 계산
  - 쿠폰 할인금액(couponDiscount) 계산
    - FIXED5000: 주문금액 ≥ 100,000원 시 5,000원 할인
    - BOGO: 동일 상품 2개 이상 시 단가 높은 상품 1개 무료
    - FREESHIPPING: 주문금액 ≥ 50,000원 시 배송비(도서산간 포함) 무료
    - MIRACLESALE: 오전 4시~7시에만 전체 주문금액 30% 할인
    - 최대 2개 쿠폰 조합 중 할인 효과가 가장 큰 조합 선택
  - 배송비(deliveryFee) 계산
    - 주문금액(쿠폰 적용 전) ≥ 100,000원이면 도서산간 포함 전액 무료
    - 10만 미만이면 기본 3,000원, isRemoteArea = true이면 +3,000원 (합 6,000원)
    - FREESHIPPING 쿠폰 적용 시 도서산간 추가 배송비 포함 전액 무료
  - 총결제금액(totalPrice) = orderAmount - couponDiscount + deliveryFee
  - 적용된 쿠폰 id 배열(appliedCoupons) 반환
  - 성공 시 200 OK
  - selectedItemIds가 비어있으면 400 Bad Request
  - coupons 배열이 3개 이상이면 400 Bad Request

---

#### 쿠폰 계산 규칙 (적용 순서·조합)

> 할인 정책 파라미터(할인액/할인율/최소주문금액 등)는 DB에 저장하지 않고, 쿠폰 `type`별로 BE 계산 로직의 상수로 관리한다. (coupons 테이블은 카탈로그만 보관)

**적용 순서 (고정)**

1. **정액 쿠폰을 먼저 적용**한다. (FIXED5000, BOGO)
2. 정액 적용으로 **할인된 금액**에 대해 **정율 쿠폰을 적용**한다. (MIRACLESALE 30%)

- 예) FIXED5000 + MIRACLESALE 동시 적용 → **5,000원 먼저 차감 → 남은 금액에 30% 할인**.
- 30%를 먼저 적용한 뒤 5,000원을 빼는 순서는 **허용하지 않는다.**

**조합 규칙**

- 최대 **2개**까지 동시 적용.
- 사용 가능한 조합 중 **할인 효과가 가장 큰 조합을 자동 선택**해 적용한다.
- 만료된 쿠폰, MIRACLESALE의 시간대(오전 4~7시) 미충족 쿠폰은 조합에서 **제외**한다.

**쿠폰별 할인 로직**

| type | 분류 | 규칙 |
| --- | --- | --- |
| `FIXED5000` | 정액 | 주문금액 ≥ 100,000원이면 5,000원 할인 |
| `BOGO` | 정액 | 동일 상품 2개↑ 구매 시, 단가 가장 높은 상품 1개 무료 |
| `FREESHIPPING` | 배송 | 주문금액 ≥ 50,000원이면 배송비(도서산간 추가분 포함) 무료 |
| `MIRACLESALE` | 정율 | 오전 4~7시에만, (정액 적용 후) 금액의 30% 할인 |

**배송비 정책**

- 주문금액(쿠폰 적용 *전*) ≥ 100,000원이면 **도서산간이어도 전액 무료**.
- 10만 미만이면 기본 3,000원, isRemoteArea = true이면 +3,000원 (합 6,000원).
- FREESHIPPING 적용 시(10만 미만이어도) 도서산간 추가분까지 무료 처리.

---

#### FE — 장바구니 페이지

- 주문 금액 미리보기 연동
  - 페이지 진입 시 `POST /order/preview` 호출 (`coupons: []`, `isRemoteArea: false`)
  - 상품 선택/해제, 수량 변경 시 재호출하여 금액 즉시 갱신
  - orderAmount, deliveryFee, totalPrice UI에 표시

---

#### FE — 주문확인 페이지

- 페이지 진입 시 `POST /order/preview` 호출 (선택된 쿠폰 id 배열 포함)
  - orderAmount, couponDiscount, deliveryFee, totalPrice 표시

- 쿠폰 적용 UI
  - `GET /coupons`로 사용 가능한 쿠폰 목록 표시
  - 최대 2개 선택 가능, 3번째 선택 시 선택 불가 처리
  - 쿠폰 선택/해제 시 `POST /order/preview` 재호출하여 할인금액 즉시 갱신
  - 만료된 쿠폰 비활성화 표시
  - MIRACLESALE 쿠폰은 오전 4시~7시 외 시간대에 비활성화 표시

- 도서·산간지역 체크박스
  - 체크 시 `isRemoteArea: true`로 `POST /order/preview` 재호출
  - 배송비 변경 즉시 반영

---

#### FE — 공통

- 상태 설계 (SSOT)
  - 선택된 상품 id 배열, 선택된 쿠폰 id 배열, isRemoteArea를 원천 상태로 관리
  - orderAmount, couponDiscount, deliveryFee, totalPrice는 서버 응답값 그대로 사용 (클라이언트 재계산 금지)

---

#### 설계 문서

- `docs/system-design.md` 작성
  - SSOT 설계 근거 설명
  - 시퀀스 다이어그램 (FE / BE / DB 3 참여자)

- `docs/api.md` 업데이트
  - `GET /coupons` 명세 추가
  - `POST /order/preview` 명세 추가 (Request / Response / Status Code)
