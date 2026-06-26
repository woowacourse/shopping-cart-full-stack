# 장바구니 API 명세 (Step 3)

> 도메인: **장바구니 / 주문 확인 / 쿠폰**

## 목차

- [상품 (Product)](#상품-product)
  - [상품 목록 조회](#1-상품-목록-조회)
  - [상품 추가](#2-상품-추가)
  - [상품 삭제](#3-상품-삭제)
- [장바구니 (Cart)](#장바구니-cart)
  - [장바구니 상품 조회](#1-장바구니-상품-조회)
  - [장바구니 결제 정보 조회](#2-장바구니-결제-정보-조회)
  - [장바구니 단일 상품 선택](#3-장바구니-단일-상품-선택)
  - [장바구니 전체 상품 선택](#4-장바구니-전체-상품-선택)
  - [장바구니 상품 수량 변경](#5-장바구니-상품-수량-변경)
  - [장바구니 상품 삭제](#6-장바구니-상품-삭제)
- [주문 확인 (Order Check)](#주문-확인-order-check)
  - [주문 확인 생성](#1-주문-확인-생성-미결정)
  - [주문 확인 상품 조회](#2-주문-확인-상품-조회)
  - [주문 확인 결제 정보 조회](#3-주문-확인-결제-정보-조회)
  - [도서 산간 지역 선택](#4-도서-산간-지역-선택)
- [쿠폰 (Coupon)](#쿠폰-coupon)
  - [쿠폰 정보 조회](#1-쿠폰-정보-조회)
  - [쿠폰 적용](#2-쿠폰-적용)

---

## 상품 (Product)

### 엔드포인트 요약

| Method   | Endpoint               | 설명           |
| -------- | ---------------------- | -------------- |
| `GET`    | `/products`            | 상품 목록 조회 |
| `POST`   | `/products`            | 상품 추가      |
| `DELETE` | `/products/:productId` | 상품 삭제      |

---

### 1. 상품 목록 조회

```
GET /products
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "products": [
      {
        "id": "string",
        "name": "string",
        "price": "number",
        "imgUrl": "string",
      },
    ],
  },
}
```

> 상품 목록이 비어있는 경우에도 `200 OK`와 빈 배열을 반환한다.

---

### 2. 상품 추가

```
POST /products
```

| 구분         | 내용                                              |
| ------------ | ------------------------------------------------- |
| Path Params  | -                                                 |
| Query Params | -                                                 |
| Request Body | `{ name: string; price: number; imgUrl: string }` |

**`201 Created`**

```jsonc
{
  "status": 201,
  "data": {
    "id": "string",
    "name": "string",
    "price": "number",
    "imgUrl": "string",
  },
}
```

**`400 Bad Request`** — 필수 필드가 누락된 경우

```jsonc
{
  "status": 400,
  "errorCode": "MISSING_FIELD",
  "errorMessage": "string",
  "data": [{ "type": "name", "errorCode": "REQUIRED" }],
}
```

**`400 Bad Request`** — 필드 값이 도메인 유효성 조건을 벗어난 경우 (예: `price` ≤ 0 등)

```jsonc
{
  "status": 400,
  "errorCode": "INVALID",
  "errorMessage": "string",
  "data": [{ "type": "price", "errorCode": "string" }],
}
```

**`400 Bad Request`** — 필드 타입이 불일치하는 경우

```jsonc
{
  "status": 400,
  "errorCode": "TYPE_MISSMATCH",
  "errorMessage": "string",
}
```

**`400 Bad Request`** — 요청 body가 json 형태가 아닌 경우 _(request body가 필요한 모든 요청에서 검증)_

```jsonc
{
  "status": 400,
  "errorCode": "NO_JSON",
  "errorMessage": "string",
}
```

> 응답 예시는 단일 필드가 실패한 경우를 나타낸다. 실제 응답에는 실패한 필드가 모두 `data` 배열에 포함된다.

---

### 3. 상품 삭제

```
DELETE /products/:productId
```

| 구분         | 내용                    |
| ------------ | ----------------------- |
| Path Params  | `{ productId: string }` |
| Query Params | -                       |
| Request Body | -                       |

**`200 OK`** — 정상적으로 productId를 받은 경우

```jsonc
{
  "status": 200,
  "data": {
    "id": "string",
  },
}
```

> 삭제된 `productId`를 반환한다. 클라이언트에서 캐시 무효화나 UI 업데이트 등에 활용할 수 있다.

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

**`404 Not Found`** — 존재하지 않는 productId로 조회하는 경우

```jsonc
{
  "status": 404,
  "errorCode": "ROUTE_NOT_FOUND",
  "errorMessage": "string",
}
```

---

## 장바구니 (Cart)

### 엔드포인트 요약

| Method   | Endpoint                           | 설명                    |
| -------- | ---------------------------------- | ----------------------- |
| `GET`    | `/cart`                            | 장바구니 상품 조회      |
| `GET`    | `/cart/pay-info`                   | 장바구니 결제 정보 조회 |
| `PATCH`  | `/carts/select/product/:productId` | 장바구니 단일 상품 선택 |
| `PATCH`  | `/carts/select`                    | 장바구니 전체 상품 선택 |
| `PATCH`  | `/carts/products/:productId`       | 장바구니 상품 수량 변경 |
| `DELETE` | `/cart/product/:productId`         | 장바구니 상품 삭제      |

---

### 1. 장바구니 상품 조회

```
GET /cart
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "isAllSelected": "boolean",
    "cartItems": [
      {
        "product": {
          "id": "string",
          "name": "string",
          "price": "number",
          "imgUrl": "string",
        },
        "quantity": "number",
        "checkStatus": "boolean",
      },
    ],
    "payInfo": {
      "orderPrice": "number",
      "deliveryFee": "number",
      "totalOrderAmount": "number",
    },
  },
}
```

> 결제 정보는 화면에서 상품 목록과 항상 함께 쓰여 별도 요청을 줄이기 위해 같이 내려준다 (`GET /cart/pay-info`는 결제 정보만 갱신하고 싶을 때를 위해 유지).

---

### 2. 장바구니 결제 정보 조회

```
GET /cart/pay-info
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "orderPrice": "number",
    "deliveryFee": "number",
    "totalOrderAmount": "number",
  },
}
```

---

### 3. 장바구니 단일 상품 선택

```
PATCH /carts/select/product/:productId
```

| 구분         | 내용                       |
| ------------ | -------------------------- |
| Path Params  | `{ productId: string }`    |
| Query Params | -                          |
| Request Body | `{ checkStatus: boolean }` |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "isAllSelected": "boolean",
    "cartItem": {
      "product": {
        "id": "string",
        "name": "string",
        "price": "number",
        "imgUrl": "string",
      },
      "quantity": "number",
      "checkStatus": "boolean",
    },
  },
}
```

**`404 Not Found`** — 존재하지 않는 product id로 조회했을 때

```jsonc
{
  "status": 404,
  "errorCode": "ROUTE_NOT_FOUND",
  "errorMessage": "string",
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

> **비고**
>
> - 멱등성을 고려하여 상품 선택 body에 `checkStatus`를 넘기기로 결정.
> - 🟡 논의: 응답으로 cartItems 정보를 조작한 productId에 대해서만 넘겨줘도 될까, 아니면 다 줘야 할까?

---

### 4. 장바구니 전체 상품 선택

```
PATCH /carts/select
```

| 구분         | 내용                       |
| ------------ | -------------------------- |
| Path Params  | -                          |
| Query Params | -                          |
| Request Body | `{ checkStatus: boolean }` |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "isAllSelected": "boolean",
    "cartItems": [
      {
        "product": {
          "id": "string",
          "name": "string",
          "price": "number",
          "imgUrl": "string",
        },
        "quantity": "number",
        "checkStatus": "boolean",
      },
    ],
  },
}
```

---

### 5. 장바구니 상품 수량 변경

```
PATCH /carts/products/:productId
```

| 구분         | 내용                    |
| ------------ | ----------------------- |
| Path Params  | `{ productId: string }` |
| Query Params | -                       |
| Request Body | `{ quantity: number }`  |

**`200 OK`** — 정상적으로 params를 받은 경우

```jsonc
{
  "status": 200,
  "data": {
    "product": {
      "id": "string",
      "name": "string",
      "price": "number",
      "imgUrl": "string",
    },
    "quantity": "number",
    "checkStatus": "boolean",
  },
}
```

**`400 Bad Request`** — quantity가 누락된 경우

```jsonc
{
  "status": 400,
  "errorCode": "MISSING_FIELD",
  "errorMessage": "string",
  "data": [{ "type": "quantity", "errorCode": "string" }],
}
```

**`400 Bad Request`** — quantity 타입이 불일치하는 경우

```jsonc
{
  "status": 400,
  "errorCode": "TYPE_MISSMATCH",
  "errorMessage": "string",
}
```

**`400 Bad Request`** — quantity가 1~99 사이가 아닌 경우 (도메인 유효성 에러)

```jsonc
{
  "status": 400,
  "errorCode": "INVALID",
  "errorMessage": "string",
  "data": [{ "type": "string", "errorCode": "string" }],
}
```

**`400 Bad Request`** — 요청 body가 json 형태가 아닌 경우 _(request body가 필요한 모든 요청에서 검증)_

```jsonc
{
  "status": 400,
  "errorCode": "NO_JSON",
  "errorMessage": "string",
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

**`404 Not Found`** — 존재하지 않는 productId로 조회하는 경우

```jsonc
{
  "status": 404,
  "errorCode": "ROUTE_NOT_FOUND",
  "errorMessage": "string",
}
```

---

### 6. 장바구니 상품 삭제

```
DELETE /cart/product/:productId
```

| 구분         | 내용                    |
| ------------ | ----------------------- |
| Path Params  | `{ productId: string }` |
| Query Params | -                       |
| Request Body | -                       |

**`200 OK`** — 정상적으로 id를 받은 경우

```jsonc
{
  "status": 200,
  "data": {
    "deletedProductId": "string",
  },
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

**`404 Not Found`** — 존재하지 않는 productId로 조회하는 경우

```jsonc
{
  "status": 404,
  "errorCode": "ROUTE_NOT_FOUND",
  "errorMessage": "string",
}
```

> **비고**
> 반환된 `deletedProductId`를 이용해 UI에서 해당 항목을 제거하거나 캐시를 갱신할 수 있다고 판단하여, 삭제된 장바구니 항목의 식별자를 반환.

---

## 주문 확인 (Order Check)

### 엔드포인트 요약

| Method  | Endpoint                           | 설명                     |
| ------- | ---------------------------------- | ------------------------ |
| `POST`  | `/order-check`                     | 주문 확인 생성           |
| `GET`   | `/order-check`                     | 주문 확인 상품 조회      |
| `GET`   | `/order-check/pay-info`            | 주문 확인 결제 정보 조회 |
| `PATCH` | `/order-check/select/remote-areas` | 도서 산간 지역 선택      |

---

### 1. 주문 확인 생성

(회원 정보는 heder에 보낸다고 가정, 회원 정보 기반으로 cartId를 판단할 것이라고 가정)

```
POST /order-check
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`201 OK`**

```jsonc
{
  "status": 201,
  "data": {
    "products": [
      {
        "id": "string // product id",
        "name": "string",
        "price": "number",
        "imgUrl": "string",
        "quantity": "number",
      },
    ],
  },
}
```

---

### 2. 주문 확인 상품 조회

```
GET /order-check
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "products": [
      {
        "id": "string // product id",
        "name": "string",
        "price": "number",
        "imgUrl": "string",
        "quantity": "number",
      },
    ],
    "payInfo": {
      "orderPrice": "number",
      "deliveryFee": "number",
      "couponDiscountAmount": "number",
      "totalOrderAmount": "number",
    },
  },
}
```

> 결제 정보는 화면에서 상품 목록과 항상 함께 쓰여 별도 요청을 줄이기 위해 같이 내려준다 (`GET /order-check/pay-info`는 결제 정보만 갱신하고 싶을 때를 위해 유지). 주문이 생성되기 전에는 `products`가 빈 배열이고 `payInfo`는 모두 0이다.

---

### 3. 주문 확인 결제 정보 조회

```
GET /order-check/pay-info
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "orderPrice": "number",
    "deliveryFee": "number",
    "couponDiscountAmount": "number",
    "totalOrderAmount": "number",
  },
}
```

**`404 Not Found`** — 해당 유저의 장바구니로 만들어진 order table이 없을 때

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

---

### 4. 도서 산간 지역 선택

```
PATCH /order-check/select/remote-areas
```

| 구분         | 내용                       |
| ------------ | -------------------------- |
| Path Params  | -                          |
| Query Params | -                          |
| Request Body | `{ checkStatus: boolean }` |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "checkStatus": "boolean",
  },
}
```

**`400 Bad Request`**

```jsonc
{
  "status": 400,
  "errorCode": "MISSING_FIELD",
  "errorMessage": "string",
  "data": [{ "type": "checkStatus", "errorCode": "REQUIRED" }],
}
```

**`404 Not Found`** — 해당 유저의 장바구니로 만들어진 order table이 없을 때

```jsonc
{
  "status": 404,
  "errorCode": "RESOURCE_NOT_FOUND",
  "errorMessage": "string",
}
```

> **비고**
>
> - 멱등성을 고려하여 상품 선택 body에 `checkStatus`를 넘기기로 결정.
> - 🟡 논의: 응답으로 products 정보를 조작한 productId에 대해서만 넘겨줘도 될까, 아니면 다 줘야 할까?
> - 도서 산간 지역 체크 상태는 주문(order) 자체의 속성으로 관리하기로 결정 — 주문이 생성되기 전에는 이 값을 저장할 곳이 없으므로 `pay-info`와 동일한 404를 반환한다.

---

## 쿠폰 (Coupon)

### 엔드포인트 요약

| Method  | Endpoint               | 설명           |
| ------- | ---------------------- | -------------- |
| `GET`   | `/order-check/coupons` | 쿠폰 정보 조회 |
| `PATCH` | `/order-check/coupons` | 쿠폰 적용      |

---

### 1. 쿠폰 정보 조회

```
GET /order-check/coupons
```

| 구분         | 내용 |
| ------------ | ---- |
| Path Params  | -    |
| Query Params | -    |
| Request Body | -    |

**`200 OK`**

```jsonc
{
  "status": 200,
  "data": {
    "coupons": [
      {
        "couponId": "string",
        "disabled": "boolean",
        "description": [{ "title": "string", "content": "string" }],
      },
    ],
    "selectedCoupons": "string[]",
  },
}
```

---

### 2. 쿠폰 적용

```
PATCH /order-check/coupons
```

| 구분         | 내용                             |
| ------------ | -------------------------------- |
| Path Params  | -                                |
| Query Params | -                                |
| Request Body | `{ selectedCouponId: string[] }` |

**`204 No Content`** — 정상 적용

**`400 Bad Request`** — 배열의 길이가 2를 초과할 때

```jsonc
{
  "status": 400,
  "errorCode": "INVALID",
  "errorMessage": "string",
  "data": {
    "errorCode": "INVALID_COUPON_COUNT",
  },
}
```

**`400 Bad Request`**

```jsonc
{
  "status": 400,
  "errorCode": "MISSING_FIELD",
  "errorMessage": "string",
  "data": [{ "type": "selectedCouponId", "errorCode": "REQUIRED" }],
}
```

---

### 3. 선택된 쿠폰 기반 할인액 계산 api

```
POST /order-check/coupons
```

| 구분         | 내용                             |
| ------------ | -------------------------------- |
| Path Params  | -                                |
| Query Params | -                                |
| Request Body | `{ selectedCouponId: string[] }` |

**`200 Ok `**

```jsonc
{
  "status": 200,
  "data": {
    "discountAmount": "number",
  },
}
```

**`400 Bad Request`**

```jsonc
{
  "status": 400,
  "errorCode": "MISSING_FIELD",
  "errorMessage": "string",
  "data": [{ "type": "selectedCouponId", "errorCode": "REQUIRED" }],
}
```
