## API 명세서

base url : https://shopping-cart-full-stack-production-9304.up.railway.app/
PORT: 8080
CORS 설정:

- Access-Control-Allow-Origin
  - http://localhost:3000
- Access-Control-Allow-Methods
  - GET, POST, PUT, DELETE (옵션 없이)
- Access-Control-Allow-Headers
  - Origin, X-Requested-With, Content-Type, Accept

---

### 상품

- 상품 조회

  | 메서드 | 요청 URL |
  | ------ | -------- |
  | GET    | /product |
  - Response Syntax

    ```
    [
        {
          "id": 1,
          "imageUrl": "https://example.com/product-image.jpg",
          "name": "상품명",
          "price": 10000,
          "quantity": 1,
        },
        {
          "id": 2,
          "imageUrl": "https://example.com/product2-image.jpg",
          "name": "상품명2",
          "price": 20000,
          "quantity": 2,
        }
    ]
    ```

  - Status Code
    - 200 OK: 성공적으로 상품들을 불러왔을 때
    - 500 Error: 실패했을 때 (DB에 Product 테이블이 존재하지 않을 때)

- 상품 등록

  | 메서드 | 요청 URL |
  | ------ | -------- |
  | POST   | /product |
  - Request Syntax

    ```
    {
      "imageUrl": "https://example.com/product3-image.jpg",
      "name": "상품명3",
      "price": 10000,
      "quantity": 5,
    }
    ```

  - Status Code
    - 201 OK: 성공적으로 상품이 생성되었을 때
    - 400 Bad Request: 실패했을 때 (잘못된 서버 요청)
    - 500 Error: 실패했을 때 (DB에 Product 테이블이 존재하지 않을 때)

- 상품 삭제
  | 메서드 | 요청 URL |
  | --- | --- |
  | DELETE | /product/:id |
  - Request Parameter
    | 파라미터 | 설명 |
    | ------ | -------- |
    | id | 상품 id |

  - Status Code
    - 204 OK: 성공적으로 상품이 삭제되었을 때
    - 404 Error: 실패했을 때 (해당 id의 상품이 Product 테이블에 존재하지 않을 때)
      — FE가 "삭제할 대상이 없었다"는 사실을 인지할 수 있도록 멱등 처리 대신 명시적 오류를 반환
    - 500 Error: 실패했을 때 (DB에 Product 테이블이 존재하지 않을 때)

---

### 장바구니

- 장바구니 상품 조회

  | 메서드 | 요청 URL |
  | ------ | -------- |
  | GET    | /cart    |
  - Response Syntax

    ```
    [
        {
          "id": 1,
          "imageUrl": "https://example.com/product-image.jpg",
          "name": "상품명",
          "price": 10000,
          "quantity": 1,
        },
        {
          "id": 2,
          "imageUrl": "https://example.com/product2-image.jpg",
          "name": "상품명2",
          "price": 20000,
          "quantity": 2,
        }
    ]
    ```

  - Status Code
    - 200 OK: 성공적으로 장바구니에 담긴 상품들을 불러왔을 때
    - 500 Error: 실패했을 때 (DB에 Cart 테이블이 존재하지 않을 때)

- 상품 등록

  | 메서드 | 요청 URL  |
  | ------ | --------- |
  | POST   | /cart/:id |
  - Request Parameter
    | 파라미터 | 설명 |
    | ------ | -------- |
    | id | 상품 id |
  - Status Code
    - 201 OK: 성공적으로 상품이 Cart 테이블에 생성되었을 때
    - 500 Error: 실패했을 때 (DB에 Cart 테이블이 존재하지 않을 때)

- 상품 수량 변경

  | 메서드 | 요청 URL |
  | ------ | -------- |
  | PUT    | /cart    |
  - Request Syntax

    ```
    {
      "id": 3
      "imageUrl": "https://example.com/product3-image.jpg",
      "name": "상품명3",
      "price": 10000,
      "quantity": 6,
    }
    ```

  - Status Code
    - 204 OK: 성공적으로 장바구니에 담긴 상품의 수량이 변겨되었을 때
    - 400 Bad Request: 실패했을 때 (잘못된 서버 요청)
    - 404 Error: 실패했을 때 (해당 id의 상품이 Cart 테이블에 존재하지 않을 때)
    - 500 Error: 실패했을 때 (DB에 Cart 테이블이 존재하지 않을 때)

- 상품 삭제
  | 메서드 | 요청 URL |
  | --- | --- |
  | DELETE | /cart/:id |
  - Request Parameter
    | 파라미터 | 설명 |
    | ------ | -------- |
    | id | 상품 id |

  - Status Code
    - 204 OK: 성공적으로 상품이 삭제되었을 때
    - 404 Error: 실패했을 때 (해당 id의 상품이 Cart 테이블에 존재하지 않을 때)
      — FE가 "삭제할 대상이 없었다"는 사실을 인지할 수 있도록 멱등 처리 대신 명시적 오류를 반환
    - 500 Error: 실패했을 때 (DB에 Cart 테이블이 존재하지 않을 때)

---

### 쿠폰

쿠폰은 등록/수정/삭제 API 없이 서버에 하드코딩으로만 관리하는 읽기 전용 데이터입니다. 적용 여부를 눌러도 인메모리 DB에서 제거되거나 변형되지 않습니다.

| type | 쿠폰 | 적용 조건 | 할인 방식 |
| --- | --- | --- | --- |
| FIXED5000 | 5,000원 할인 쿠폰 | 주문 금액 100,000원 이상 | 정액 5,000원 할인 |
| BOGO | 2개 구매 시 1개 무료 쿠폰 | 동일 상품을 3개 이상 구매 | 단가가 가장 높은 1개 무료 |
| FREESHIPPING | 5만원 이상 구매 시 무료 배송 쿠폰 | 주문 금액 50,000원 이상 100,000원 미만 | 배송비 무료 (도서산간 포함) |
| MIRACLESALE | 미라클모닝 30% 할인 쿠폰 | 오전 4시 ~ 7시 | 정율 30% 할인 |

> **할인 계산 규칙**: 쿠폰은 최대 2개까지 사용할 수 있습니다. 정액 쿠폰(FIXED5000, BOGO)을 먼저 적용한 뒤, 할인된 금액에 정율 쿠폰(MIRACLESALE)을 적용합니다. 서버는 가능한 조합 중 최종 결제 금액이 가장 낮은 조합을 자동으로 선택합니다.

> **배송비 정책**: 기본 배송비 3,000원. 쿠폰 적용 전 주문 금액이 100,000원 이상이면 무료. 도서산간 지역은 +3,000원. FREESHIPPING 쿠폰은 도서산간 포함 배송비 전액 무료.

- 쿠폰 목록 조회

  | 메서드 | 요청 URL |
  | ------ | -------- |
  | GET    | /coupons |
  - Response Syntax

    ```
    [
        {
          "id": 1,
          "name": "5,000원 할인 쿠폰",
          "type": "FIXED5000",
          "expirationDate": "2026-11-30"
        },
        {
          "id": 2,
          "name": "2개 구매 시 1개 무료 쿠폰",
          "type": "BOGO",
          "expirationDate": "2026-06-30"
        },
        {
          "id": 3,
          "name": "5만원 이상 구매 시 무료 배송 쿠폰",
          "type": "FREESHIPPING",
          "expirationDate": "2026-08-31"
        },
        {
          "id": 4,
          "name": "미라클모닝 30% 할인 쿠폰",
          "type": "MIRACLESALE",
          "expirationDate": "2026-07-31"
        }
    ]
    ```

  - Status Code
    - 200 OK: 성공적으로 쿠폰 목록을 불러왔을 때
    - 500 Error: 실패했을 때 (DB에 Coupon 테이블이 존재하지 않을 때)

---

### 주문

- 주문 금액 계산

  | 메서드 | 요청 URL       |
  | ------ | -------------- |
  | POST   | /order/preview |
  - Request Syntax

    ```
    {
      "selectedItemIds": [1, 2, 3],
      "coupons": [1, 2],
      "isRemoteArea": false
    }
    ```

  - Request Body
    | 필드 | 타입 | 필수 | 설명 |
    | --- | --- | --- | --- |
    | selectedItemIds | number[] | O | 선택된 CartItem id 배열 (비어 있으면 400) |
    | coupons | number[] | X | 적용할 쿠폰 id 배열 (최대 2개). **생략 시 서버가 사용 가능한 전체 쿠폰 중 최적 조합을 자동 선택**한다. 빈 배열(`[]`)을 보내면 쿠폰 미적용으로 계산한다. |
    | isRemoteArea | boolean | X | 제주 및 도서산간 지역 여부 (기본 false) |

  - Response Syntax

    ```
    {
      "orderAmount": 150000,
      "couponDiscount": 5000,
      "deliveryFee": 0,
      "originalDeliveryFee": 0,
      "totalPrice": 145000,
      "appliedCoupons": [1],
      "couponStatuses": [
        { "id": 1, "applicable": true },
        { "id": 2, "applicable": false },
        { "id": 3, "applicable": false },
        { "id": 4, "applicable": false }
      ]
    }
    ```

  - Response Body
    | 필드 | 타입 | 설명 |
    | --- | --- | --- |
    | orderAmount | number | 쿠폰 적용 전 주문금액 |
    | couponDiscount | number | 쿠폰 할인금액 |
    | deliveryFee | number | 쿠폰 적용 후 최종 배송비 |
    | originalDeliveryFee | number | 쿠폰 미적용 기준 배송비 (FREESHIPPING의 배송비 절감액 표시용) |
    | totalPrice | number | 최종 결제금액 (orderAmount - couponDiscount + deliveryFee) |
    | appliedCoupons | number[] | 실제 적용된 쿠폰 id 배열 |
    | couponStatuses | { id: number, applicable: boolean }[] | 각 쿠폰의 현재 사용 가능 여부. 조건 미충족 쿠폰은 `applicable: false`로 내려주며, 클라이언트는 이를 기준으로 모달에서 선택을 차단한다. |

  - Status Code
    - 200 OK: 성공적으로 주문 금액을 계산했을 때
    - 400 Bad Request: 실패했을 때 (selectedItemIds가 비어있거나 coupons가 3개 이상일 때)
    - 500 Error: 실패했을 때 (DB에 CartItem 또는 Coupon 테이블이 존재하지 않을 때)
