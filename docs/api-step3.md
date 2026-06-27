# 3단계 API 명세서

## 1. 공통 규칙

### 1-1. Base URL

```http
http://localhost:3000
```

### 1-2. 요청 형식

- 요청 body는 JSON 형식으로 전달한다.
- 요청 body가 필요한 API는 `Content-Type: application/json`을 사용한다.

### 1-3. 응답 형식

- 응답 body는 JSON 형식으로 전달한다.
- 날짜는 ISO 문자열 형식으로 응답한다.
- 에러 응답은 공통 에러 응답 형식으로 반환한다.

### 1-4. 공통 에러 응답

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

### 1-5. 상태 코드

| 상태 코드                   | 설명                                        |
| --------------------------- | ------------------------------------------- |
| `200 OK`                    | 조회, 수정 성공                             |
| `201 Created`               | 생성 성공                                   |
| `400 Bad Request`           | 잘못된 요청 또는 적용할 수 없는 도메인 규칙 |
| `404 Not Found`             | 존재하지 않는 리소스                        |
| `500 Internal Server Error` | 서버 내부 오류                              |

### 1-6. 주요 응답 타입

#### PriceInfo

```json
{
  "orderPrice": 120000,
  "productDiscountPrice": 5000,
  "deliveryDiscountPrice": 0,
  "deliveryFee": 0,
  "totalPrice": 115000
}
```

| 필드                    | 타입     | 설명                                            |
| ----------------------- | -------- | ----------------------------------------------- |
| `orderPrice`            | `number` | 쿠폰 할인과 배송비가 적용되기 전 주문 상품 금액 |
| `productDiscountPrice`  | `number` | 상품 금액에서 차감되는 쿠폰 할인 금액           |
| `deliveryDiscountPrice` | `number` | 배송비에서 차감되는 쿠폰 할인 금액              |
| `deliveryFee`           | `number` | 최종 배송비                                     |
| `totalPrice`            | `number` | 최종 결제 금액                                  |

`totalPrice`는 아래 식으로 계산된다.

```ts
totalPrice =
  orderPrice - productDiscountPrice - deliveryDiscountPrice + deliveryFee;
```

## 2. 주문 API

### 2-1. 주문 생성

선택된 장바구니 상품 목록을 기준으로 주문 정보를 생성한다.

```http
POST /orders
```

#### Request

```json
{
  "products": [
    {
      "productId": "product-1",
      "quantity": 3
    }
  ]
}
```

| 필드                   | 타입     | 필수 여부 | 설명             |
| ---------------------- | -------- | --------- | ---------------- |
| `products`             | `Array`  | 필수      | 주문할 상품 목록 |
| `products[].productId` | `string` | 필수      | 상품 id          |
| `products[].quantity`  | `number` | 필수      | 주문 수량         |

서버는 주문 생성 시점에 적용 가능한 쿠폰 조합을 계산하고, 할인 금액이 가장 큰 조합을 주문에 자동 적용한다.

#### Response

`201 Created`

```json
{
  "orderId": "order-20260612-0001"
}
```

#### Error

주문 상품 목록이 비어 있는 경우 `400 Bad Request`

```json
{
  "code": "EMPTY_ORDER_PRODUCTS",
  "message": "주문 상품 목록이 비어 있습니다."
}
```

쿠폰이 2개를 초과하는 경우 `400 Bad Request`

```json
{
  "code": "EXCEEDS_MAX_COUPON_COUNT",
  "message": "쿠폰은 최대 2개까지만 적용할 수 있습니다."
}
```

중복된 쿠폰 id가 포함된 경우 `400 Bad Request`

```json
{
  "code": "DUPLICATE_COUPON_ID",
  "message": "중복된 쿠폰은 적용할 수 없습니다."
}
```

상품이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "존재하지 않는 상품입니다."
}
```

---

### 2-2. 주문 조회

주문 id를 기준으로 주문 상품 정보, 적용된 쿠폰, 배송 지역 여부, 가격 정보를 조회한다.

```http
GET /orders/:orderId
```

#### Request

없음

#### Response

`200 OK`

```json
{
  "orderId": "order-20260612-0001",
  "products": [
    {
      "productId": "product-1",
      "productName": "콜라",
      "productPrice": 12000,
      "imageUrl": "src/assets/coke.png",
      "quantity": 3
    }
  ],
  "isIsland": false,
  "couponIds": [],
  "priceInfo": {
    "orderPrice": 36000,
    "productDiscountPrice": 0,
    "deliveryDiscountPrice": 0,
    "deliveryFee": 3000,
    "totalPrice": 39000
  }
}
```

#### Error

주문이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

주문에 포함된 상품이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "존재하지 않는 상품입니다."
}
```

주문에 적용된 쿠폰이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "COUPON_NOT_FOUND",
  "message": "존재하지 않는 쿠폰입니다."
}
```

---

### 2-3. 주문 쿠폰 적용

선택한 쿠폰 목록을 주문에 적용한다. 서버는 쿠폰 id가 존재하는지, 현재 주문에 적용 가능한 쿠폰인지 다시 검증한다.

```http
PATCH /orders/:orderId/coupons
```

#### Request

```json
{
  "couponIds": ["FIXED5000"]
}
```

| 필드        | 타입       | 필수 여부 | 설명                          |
| ----------- | ---------- | --------- | ----------------------------- |
| `couponIds` | `string[]` | 필수      | 적용할 쿠폰 id 목록. 최대 2개 |

#### Response

`200 OK`

```json
{
  "couponIds": ["FIXED5000"],
  "priceInfo": {
    "orderPrice": 120000,
    "productDiscountPrice": 5000,
    "deliveryDiscountPrice": 0,
    "deliveryFee": 0,
    "totalPrice": 115000
  }
}
```

#### Error

주문이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

쿠폰이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "COUPON_NOT_FOUND",
  "message": "존재하지 않는 쿠폰입니다."
}
```

현재 주문에 적용할 수 없는 쿠폰인 경우 `400 Bad Request`

```json
{
  "code": "INVALID_COUPON",
  "message": "적용할 수 없는 쿠폰입니다."
}
```

쿠폰이 2개를 초과하는 경우 `400 Bad Request`

```json
{
  "code": "EXCEEDS_MAX_COUPON_COUNT",
  "message": "쿠폰은 최대 2개까지만 적용할 수 있습니다."
}
```

중복된 쿠폰 id가 포함된 경우 `400 Bad Request`

```json
{
  "code": "DUPLICATE_COUPON_ID",
  "message": "중복된 쿠폰은 적용할 수 없습니다."
}
```

---

### 2-4. 주문 배송 지역 변경

제주도 및 도서산간 지역 여부를 변경하고, 변경된 배송비와 가격 정보를 다시 계산한다.

```http
PATCH /orders/:orderId/delivery-area
```

#### Request

```json
{
  "isIsland": true
}
```

| 필드       | 타입      | 필수 여부 | 설명                         |
| ---------- | --------- | --------- | ---------------------------- |
| `isIsland` | `boolean` | 필수      | 제주도 및 도서산간 지역 여부 |

#### Response

`200 OK`

```json
{
  "orderPrice": 36000,
  "productDiscountPrice": 0,
  "deliveryDiscountPrice": 0,
  "deliveryFee": 6000,
  "totalPrice": 42000
}
```

#### Error

주문이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

### 2-5. 선택 쿠폰 할인 금액 미리보기

쿠폰 모달에서 선택 중인 쿠폰 id 목록을 기준으로 할인 금액을 계산한다. 계산 결과만 반환하며 주문에 적용된 `couponIds`는 변경하지 않는다.

```http
POST /orders/:orderId/discount-price
```

#### Request

```json
{
  "couponIds": ["FIXED5000"]
}
```

| 필드        | 타입       | 필수 여부 | 설명                              |
| ----------- | ---------- | --------- | --------------------------------- |
| `couponIds` | `string[]` | 필수      | 미리보기할 쿠폰 id 목록. 최대 2개 |

#### Response

`200 OK`

```json
{
  "couponIds": ["FIXED5000"],
  "productDiscountPrice": 5000,
  "deliveryDiscountPrice": 0,
  "totalDiscountPrice": 5000
}
```

| 필드                    | 타입       | 설명                             |
| ----------------------- | ---------- | -------------------------------- |
| `couponIds`             | `string[]` | 할인 계산에 사용한 쿠폰 id 목록  |
| `productDiscountPrice`  | `number`   | 상품 금액에서 차감되는 할인 금액 |
| `deliveryDiscountPrice` | `number`   | 배송비에서 차감되는 할인 금액    |
| `totalDiscountPrice`    | `number`   | 상품 할인과 배송 할인의 합계     |

#### Error

쿠폰 id 목록 형식이 유효하지 않은 경우 `400 Bad Request`

```json
{
  "code": "INVALID_COUPON_IDS",
  "message": "유효하지 않은 쿠폰 목록입니다."
}
```

쿠폰이 2개를 초과하는 경우 `400 Bad Request`

```json
{
  "code": "EXCEEDS_MAX_COUPON_COUNT",
  "message": "쿠폰은 최대 2개까지만 적용할 수 있습니다."
}
```

중복된 쿠폰 id가 포함된 경우 `400 Bad Request`

```json
{
  "code": "DUPLICATE_COUPON_ID",
  "message": "중복된 쿠폰은 적용할 수 없습니다."
}
```

현재 주문에 적용할 수 없는 쿠폰인 경우 `400 Bad Request`

```json
{
  "code": "INVALID_COUPON",
  "message": "적용할 수 없는 쿠폰입니다."
}
```

주문이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

쿠폰이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "COUPON_NOT_FOUND",
  "message": "존재하지 않는 쿠폰입니다."
}
```

주문에 포함된 상품이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "존재하지 않는 상품입니다."
}
```

## 3. 쿠폰 API

### 3-1. 주문 기준 쿠폰 목록 조회

주문 id를 기준으로 사용자의 쿠폰 목록을 조회한다. 서버는 현재 주문 상품, 주문 금액, 배송 지역 여부, 현재 시간을 기준으로 각 쿠폰의 사용 가능 여부를 계산한다.

```http
GET /orders/:orderId/coupons
```

#### Request

없음

#### Response

`200 OK`

```json
{
  "couponList": [
    {
      "couponId": "FIXED5000",
      "couponName": "5,000원 할인 쿠폰",
      "couponDescription": "최소 주문 금액: 100,000원",
      "isDisabled": false,
      "couponExpiration": "2026-11-30T14:59:59.000Z"
    },
    {
      "couponId": "BOGO",
      "couponName": "2개 구매 시 1개 무료 쿠폰",
      "couponDescription": "",
      "isDisabled": false,
      "couponExpiration": "2026-06-30T14:59:59.000Z"
    },
    {
      "couponId": "FREESHIPPING",
      "couponName": "5만원 이상 구매 시 무료 배송 쿠폰",
      "couponDescription": "최소 주문 금액: 50,000원",
      "isDisabled": false,
      "couponExpiration": "2026-08-31T14:59:59.000Z"
    },
    {
      "couponId": "MIRACLESALE",
      "couponName": "미라클모닝 30% 할인 쿠폰",
      "couponDescription": "사용 가능 시간: 오전 4시부터 7시까지",
      "isDisabled": false,
      "couponExpiration": "2026-07-31T14:59:59.000Z"
    }
  ]
}
```

| 필드                | 타입      | 설명                                   |
| ------------------- | --------- | -------------------------------------- |
| `couponId`          | `string`  | 쿠폰 id                                |
| `couponName`        | `string`  | 쿠폰 이름                              |
| `couponDescription` | `string`  | 쿠폰 사용 조건 설명                    |
| `isDisabled`        | `boolean` | 현재 주문 기준 쿠폰 선택 비활성화 여부 |
| `couponExpiration`  | `string`  | 쿠폰 만료일 ISO 문자열                 |

#### Error

주문이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "ORDER_NOT_FOUND",
  "message": "존재하지 않는 주문입니다."
}
```

주문에 포함된 상품이 존재하지 않는 경우 `404 Not Found`

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "존재하지 않는 상품입니다."
}
```

## 4. 쿠폰 id 목록

| 쿠폰 id        | 이름                              | 조건                         |
| -------------- | --------------------------------- | ---------------------------- |
| `FIXED5000`    | 5,000원 할인 쿠폰                 | 주문 금액 100,000원 이상     |
| `BOGO`         | 2개 구매 시 1개 무료 쿠폰         | 동일 상품 3개 이상 구매      |
| `FREESHIPPING` | 5만원 이상 구매 시 무료 배송 쿠폰 | 주문 금액 50,000원 이상      |
| `MIRACLESALE`  | 미라클모닝 30% 할인 쿠폰          | 오전 4시 이상, 오전 7시 미만 |
