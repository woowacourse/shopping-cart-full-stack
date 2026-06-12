# 장바구니 API 명세 (Step 3)

> 도메인: **장바구니 / 주문 확인 / 쿠폰**

## 목차

-   [장바구니 (Cart)](#장바구니-cart)
    -   [장바구니 상품 조회](#1-장바구니-상품-조회)
    -   [장바구니 결제 정보 조회](#2-장바구니-결제-정보-조회)
    -   [장바구니 단일 상품 선택](#3-장바구니-단일-상품-선택)
    -   [장바구니 전체 상품 선택](#4-장바구니-전체-상품-선택)
    -   [장바구니 상품 수량 변경](#5-장바구니-상품-수량-변경)
    -   [장바구니 상품 삭제](#6-장바구니-상품-삭제)
-   [주문 확인 (Order Check)](#주문-확인-order-check)
    -   [주문 확인 생성](#1-주문-확인-생성-미결정)
    -   [주문 확인 상품 조회](#2-주문-확인-상품-조회)
    -   [주문 확인 결제 정보 조회](#3-주문-확인-결제-정보-조회)
    -   [도서 산간 지역 선택](#4-도서-산간-지역-선택)
-   [쿠폰 (Coupon)](#쿠폰-coupon)
    -   [쿠폰 정보 조회](#1-쿠폰-정보-조회)
    -   [쿠폰 적용](#2-쿠폰-적용)

---

## 장바구니 (Cart)

### 엔드포인트 요약

| Method   | Endpoint                           | 설명                    |
| -------- | ---------------------------------- | ----------------------- |
| `GET`    | `/cart`                            | 장바구니 상품 조회      |
| `GET`    | `/cart/pay-info`                   | 장바구니 결제 정보 조회 |
| `PATCH`  | `/cartt/select/product/:productId` | 장바구니 단일 상품 선택 |
| `PATCH`  | `/cartt/select`                    | 장바구니 전체 상품 선택 |
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
        "id": "number // cart id",
        "isAllSelected": "boolean",
        "products": [
            {
                "id": "number // product id",
                "name": "string",
                "price": "number",
                "imgUrl": "string",
                "quantity": "number",
                "stock": "number",
                "checkStatus": "boolean"
            }
        ]
    }
}
```

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
        "id": "number // cart id",
        "orderPrice": "number",
        "deliveryFee": "number",
        "totalOrderAmount": "number"
    }
}
```

---

### 3. 장바구니 단일 상품 선택

```
PATCH /cartt/select/product/:productId
```

| 구분         | 내용                          |
| ------------ | ----------------------------- |
| Path Params  | `{ productId: string }`       |
| Query Params | -                             |
| Request Body | `{ selectedStatus: boolean }` |

**`200 OK`**

```jsonc
{
    "status": 200,
    "data": {
        "id": "number // cart id",
        "isAllSelected": "boolean",
        "product": {
            "id": "number // product id",
            "name": "string",
            "price": "number",
            "imgUrl": "string",
            "quantity": "number",
            "stock": "number",
            "checkStatus": "boolean"
        }
    }
}
```

**`404 Not Found`** — 존재하지 않는 product id로 조회했을 때

```jsonc
{
    "status": 404,
    "errorCode": "ROUTE_NOT_FOUND",
    "errorMessage": "string"
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
    "status": 404,
    "errorCode": "RESOURCE_NOT_FOUND",
    "errorMessage": "string"
}
```

> **비고**
>
> -   멱등성을 고려하여 상품 선택 body에 `selectedStatus`를 넘기기로 결정.
> -   🟡 논의: 응답으로 products 정보를 조작한 productId에 대해서만 넘겨줘도 될까, 아니면 다 줘야 할까?

---

### 4. 장바구니 전체 상품 선택

```
PATCH /cartt/select
```

| 구분         | 내용                          |
| ------------ | ----------------------------- |
| Path Params  | -                             |
| Query Params | -                             |
| Request Body | `{ selectedStatus: boolean }` |

**`200 OK`**

```jsonc
{
    "status": 200,
    "data": {
        "id": "number // cart id",
        "isAllSelected": "boolean",
        "products": [
            {
                "id": "number // product id",
                "name": "string",
                "price": "number",
                "imgUrl": "string",
                "quantity": "number",
                "stock": "number",
                "checkStatus": "boolean"
            }
        ]
    }
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
        "id": "string // product id",
        "name": "string",
        "price": "number",
        "imgUrl": "string",
        "quantity": "number",
        "selectedStatus": "boolean"
    }
}
```

**`400 Bad Request`** — quantity가 누락된 경우

```jsonc
{
    "status": 400,
    "errorCode": "MISSING_FIELD",
    "errorMessage": "string",
    "data": [{ "type": "quantity", "errorCode": "string" }]
}
```

**`400 Bad Request`** — quantity 타입이 불일치하는 경우

```jsonc
{
    "status": 400,
    "errorCode": "TYPE_MISSMATCH",
    "errorMessage": "string"
}
```

**`400 Bad Request`** — quantity가 1~99 사이가 아닌 경우 (도메인 유효성 에러)

```jsonc
{
    "status": 400,
    "errorCode": "INVALID",
    "errorMessage": "string",
    "data": [{ "type": "string", "errorCode": "string" }]
}
```

**`400 Bad Request`** — 요청 body가 json 형태가 아닌 경우 _(request body가 필요한 모든 요청에서 검증)_

```jsonc
{
    "status": 400,
    "errorCode": "NO_JSON",
    "errorMessage": "string"
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
    "status": 404,
    "errorCode": "RESOURCE_NOT_FOUND",
    "errorMessage": "string"
}
```

**`404 Not Found`** — 존재하지 않는 productId로 조회하는 경우

```jsonc
{
    "status": 404,
    "errorCode": "ROUTE_NOT_FOUND",
    "errorMessage": "string"
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
        "deletedProductId": "string"
    }
}
```

**`404 Not Found`** — productId가 누락된 경우

```jsonc
{
    "status": 404,
    "errorCode": "RESOURCE_NOT_FOUND",
    "errorMessage": "string"
}
```

**`404 Not Found`** — 존재하지 않는 productId로 조회하는 경우

```jsonc
{
    "status": 404,
    "errorCode": "ROUTE_NOT_FOUND",
    "errorMessage": "string"
}
```

> **비고**
> 반환된 `deletedProductId`를 이용해 UI에서 해당 항목을 제거하거나 캐시를 갱신할 수 있다고 판단하여, 삭제된 장바구니 항목의 식별자를 반환.

---

## 주문 확인 (Order Check)

### 엔드포인트 요약

| Method  | Endpoint                           | 설명                      |
| ------- | ---------------------------------- | ------------------------- |
| `POST`  | `/order-check`                     | 주문 확인 생성 _(미결정)_ |
| `GET`   | `/order-check`                     | 주문 확인 상품 조회       |
| `GET`   | `/order-check/pay-info`            | 주문 확인 결제 정보 조회  |
| `PATCH` | `/order-check/select/remote-areas` | 도서 산간 지역 선택       |

---

### 1. 주문 확인 생성 _(미결정)_

```
POST /order-check
```

| 구분         | 내용             |
| ------------ | ---------------- |
| Request Body | `{ }` _(미결정)_ |

> **🟡 논의 중: body에 productId를 넘겨야 할까?**
>
> **포도 생각**
> selected 상태를 DB에 저장하는 현 상황에서, 클라이언트가 그 데이터를 바탕으로 선택된 상품 목록을 골라 body로 요청을 하게 된다면, 선택 상태의 원천이 서버와 클라이언트로 나뉘게 되는 것 같다. 서버에는 이미 `cart_items.selected` 값이 저장되어 있는데, 클라이언트가 다시 productId 또는 cartItemId 목록을 body로 전달하면 서버는 주문 생성 시점에 어떤 값을 기준으로 삼아야 하는지 모호해진다.
> 예를 들어 DB에는 1번, 3번 상품만 선택되어 있는데 요청 body에는 1번, 2번, 3번 상품이 전달될 수 있다. 이 경우 DB의 선택 상태를 믿을지, 클라이언트가 보낸 요청 값을 믿을지 추가적인 판단과 검증이 필요해진다.
>
> **라바 생각**
> request body에 담아야 한다는 생각. 클라이언트에서 서버에 명확하게 어떤 것을 생성해 달라고 요청하는 느낌이 들고, 요청과 응답을 봤을 때 뭘 하는 건지 더 명확하게 드러난다. 클라이언트에서 상태를 다루지 않기 때문에 정보의 원천은 한 곳에 있다는 사실도 유지된다고 생각함. cartItem의 상태에 따라서 클라이언트 입장에서든 같은 요청에 다른 결과가 나타나게 되는 설계임.

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
                "quantity": "number"
            }
        ]
    }
}
```

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
        "id": "number // cart id",
        "orderPrice": "number",
        "deliveryFee": "number",
        "totalOrderAmount": "number"
    }
}
```

**`404 Not Found`** — 해당 유저의 장바구니로 만들어진 order table이 없을 때

```jsonc
{
    "status": 404,
    "errorCode": "RESOURCE_NOT_FOUND",
    "errorMessage": "string"
}
```

---

### 4. 도서 산간 지역 선택

```
PATCH /order-check/select/remote-areas
```

| 구분         | 내용                          |
| ------------ | ----------------------------- |
| Path Params  | -                             |
| Query Params | -                             |
| Request Body | `{ selectedStatus: boolean }` |

**`200 OK`**

```jsonc
{
    "status": 200,
    "data": {
        "isSelected": "boolean"
    }
}
```

**`400 Bad Request`**

```jsonc
{
    "status": 400,
    "errorCode": "MISSING_FIELD",
    "errorMessage": "string",
    "data": [{ "type": "selectedStatus", "errorCode": "REQUIRED" }]
}
```

> **비고**
>
> -   멱등성을 고려하여 상품 선택 body에 `selectedStatus`를 넘기기로 결정.
> -   🟡 논의: 응답으로 products 정보를 조작한 productId에 대해서만 넘겨줘도 될까, 아니면 다 줘야 할까?

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
                "discountAmount": "number",
                "description": [{ "title": "string", "content": "string" }]
            }
        ]
    }
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
        "errorCode": "INVALID_COUPON_COUNT"
    }
}
```
