# API 명세서

## 1. 공통 규칙

### 1-1. Base URL

```
http://localhost:8080
```

### 1-2. 요청 형식

- 요청 body는 JSON 형식으로 전달한다.
- 요청 body가 필요한 API는 `Content-Type: application/json`을 사용한다.

### 1-3. 응답 형식

- 응답 body는 JSON 형식으로 전달한다.
- 성공 응답은 `{ "status": "success", "message": "...", "data": ... }` 형식으로 반환한다.
- 에러 응답은 `{ "status": "error", "message": "..." }` 형식으로 반환한다(`data` 없음).

### 1-4. 주요 식별자

| 이름      | 설명      |
| --------- | --------- |
| `order`   | 주문 정보 |
| `coupons` | 쿠폰 정보 |

### 1-5. 상태 코드

| 상태 코드                   | 설명                 |
| --------------------------- | -------------------- |
| `200 OK`                    | 조회, 수정 성공      |
| `201 Created`               | 생성 성공            |
| `400 Bad Request`           | 잘못된 요청          |
| `404 Not Found`             | 존재하지 않는 리소스 |
| `500 Internal Server Error` | 서버 내부 오류       |

### 1-6. 에러 응답

```json
{
  "status": "error",
  "message": "존재하지 않는 쿠폰입니다."
}
```

## 2. 주문 정보 API

### 2-1. 주문 정보 조회

```http
GET /order
```

#### Request

없음

#### Response

`200 OK`

```json
{
  "status": "success",
  "message": "주문 정보를 정상적으로 조회하였습니다.",
  "data": {
    "orderId": "order-20260612-0001",
    "orderProducts": [
      {
        "productId": "prod-1001",
        "productName": "상품A",
        "productPrice": 16000,
        "imgUrl": "./asset/imageA.png",
        "quantity": 2
      },
      {
        "productId": "prod-1002",
        "productName": "상품B",
        "productPrice": 11000,
        "imgUrl": "./asset/imageB.png",
        "quantity": 1
      }
    ],
    "isIsland": false,
    "couponIds": ["FIXED5000", "FREESHIPPING"],
    "priceInfo": {
      "orderPrice": 58000,
      "discountPrice": 10800,
      "deliveryFee": 3000,
      "totalPrice": 50200
    }
  }
}
```

#### Error

저장된 주문이 없는 경우 `404 Not Found`를 응답한다.

```json
{
  "status": "error",
  "message": "존재하지 않는 주문입니다."
}
```

---

### 2-2. 주문 정보 추가

```http
POST /order
```

#### Request

```json
{
  "orderProducts": [
    {
      "productId": "prod-1001",
      "quantity": 2
    },
    {
      "productId": "prod-1002",
      "quantity": 1
    }
  ]
}
```

- 그 외 속성값들은 모두 내부적으로 초기화된다. `isIsland`는 `false`로 설정되고, `couponIds`는 서버가 할인 금액이 가장 큰 최적 쿠폰(최대 2개)을 자동으로 선택해 채운다.

| 이름            | 필수 여부 | 설명                                                         |
| --------------- | --------- | ------------------------------------------------------------ |
| `orderProducts` | 필수      | 누락되거나 빈 배열이면 400                                   |
| `productId`     | 필수      | 문자열이 아니면 400, 존재하지 않는 상품이면 404              |
| `quantity`      | 필수      | 숫자가 아니면 400, 1 이상 99 이하가 아니면 400               |

#### Response

`201 Created`

```json
{
  "status": "success",
  "message": "주문 정보를 정상적으로 추가하였습니다.",
  "data": {
    "orderId": "order-20260612-0001"
  }
}
```

#### Error

`orderProducts`가 누락/빈 배열이거나 항목 형식이 유효하지 않을 때 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "유효하지 않은 주문 상품 정보입니다."
}
```

`quantity`가 1~99 범위를 벗어난 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "주문 수량은 1~99까지 가능합니다."
}
```

productId에 해당하는 상품이 존재하지 않는 경우 `404 Not Found`를 응답한다.

```json
{
  "status": "error",
  "message": "존재하지 않는 상품입니다."
}
```

---

### 2-3. 주문 정보 수정

```http
PATCH /order
```

#### Request

`couponIds` 또는 `isIsland` 중 하나만 전달한다. 두 필드를 함께 보내면 `couponIds`만 반영되고 `isIsland`는 무시된다.

```json
{
  "couponIds": ["FIXED5000", "BOGO"]
}
```

또는

```json
{
  "isIsland": true
}
```

| 이름        | 필수 여부 | 설명                                                      |
| ----------- | --------- | --------------------------------------------------------- |
| `couponIds` | 선택      | 문자열 배열이 아니면 400                                   |
| `couponIds` | 선택      | 적용 쿠폰이 2개를 초과하면 400                            |
| `couponIds` | 선택      | 존재하지 않는 쿠폰이 포함되면 404                          |
| `couponIds` | 선택      | 최소 주문 금액 등 사용 조건을 만족하지 않는 쿠폰이 포함되면 400 |
| `isIsland`  | 선택      | boolean이 아니면 400                                      |

#### Response

`200 OK`

```json
{
  "status": "success",
  "message": "주문 정보를 정상적으로 수정하였습니다.",
  "data": {
    "priceInfo": {
      "orderPrice": 58000,
      "discountPrice": 10800,
      "deliveryFee": 6000,
      "totalPrice": 53200
    }
  }
}
```

#### Error

`couponIds`가 문자열 배열이 아닌 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "올바르지 않은 쿠폰 ID입니다."
}
```

적용 쿠폰이 2개를 초과한 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "쿠폰은 최대 2개까지 적용할 수 있습니다."
}
```

`isIsland`가 boolean이 아닌 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "올바르지 않은 도서 산간 정보입니다."
}
```

couponIds에 해당하는 쿠폰이 존재하지 않는 경우 `404 Not Found`를 응답한다.

```json
{
  "status": "error",
  "message": "존재하지 않는 쿠폰입니다."
}
```

쿠폰이 존재하더라도 최소 주문 금액 등 사용 조건을 만족하지 못해 적용할 수 없는 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "사용할 수 없는 쿠폰입니다."
}
```

### 2-4. 할인율 계산

```http
POST /order/discount-price
```

#### Request

```json
{
  "couponIds": ["FIXED5000", "BOGO"]
}
```

| 이름        | 필수 여부 | 설명                                                 |
| ----------- | --------- | ---------------------------------------------------- |
| `couponIds` | 필수      | 누락되거나 문자열 배열이 아니면 400                  |
| `couponIds` | 필수      | 존재하지 않는 쿠폰이 포함되면 404                    |
| `couponIds` | 필수      | 사용 조건을 만족하지 않는 쿠폰이 포함되면 400        |

#### Response

`200 OK`

```json
{
  "status": "success",
  "message": "할인 금액을 정상적으로 계산하였습니다.",
  "data": {
    "discountPrice": 6000
  }
}
```

#### Error

`couponIds`가 누락되거나 문자열 배열이 아닌 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "올바르지 않은 쿠폰 ID입니다."
}
```

couponIds에 해당하는 쿠폰이 존재하지 않는 경우 `404 Not Found`를 응답한다.

```json
{
  "status": "error",
  "message": "존재하지 않는 쿠폰입니다."
}
```

쿠폰이 존재하더라도 최소 주문 금액 등 사용 조건을 만족하지 못해 적용할 수 없는 경우 `400 Bad Request`를 응답한다.

```json
{
  "status": "error",
  "message": "사용할 수 없는 쿠폰입니다."
}
```

## 3. 쿠폰 정보 API

### 3-1. 쿠폰 목록 조회

```http
GET /coupons
```

#### Request

없음

#### Response

`200 OK`

```json
{
  "status": "success",
  "message": "쿠폰 목록을 정상적으로 조회하였습니다.",
  "data": {
    "couponList": [
      {
        "couponId": "FIXED5000",
        "couponName": "5,000원 할인 쿠폰",
        "isDisabled": false,
        "couponExpiration": 1796050799000,
        "option": "최소 주문 금액: 100,000원"
      },
      {
        "couponId": "BOGO",
        "couponName": "2+1 쿠폰",
        "isDisabled": false,
        "couponExpiration": 1782831599000
      },
      {
        "couponId": "FREESHIPPING",
        "couponName": "무료 배송 쿠폰",
        "isDisabled": false,
        "couponExpiration": 1788188399000,
        "option": "최소 주문 금액: 50,000원"
      },
      {
        "couponId": "MIRACLESALE",
        "couponName": "30% 시간제 할인 쿠폰",
        "isDisabled": false,
        "couponExpiration": 1785509999000,
        "option": "사용 가능 시간: 오전 4시부터 7시까지"
      }
    ]
  }
}
```

- `isDisabled`는 저장된 비활성화 여부와 만료 여부(`couponExpiration < 현재 시각`)를 OR로 계산해 BE에서 내려준다. 따라서 조회 시점에 따라 값이 달라질 수 있다.
- `option`은 최소 주문 금액 또는 사용 가능 시간 제약이 있을 때만 포함된다. `BOGO`처럼 제약이 없는 쿠폰은 `option`이 생략된다.

#### Error

없음
