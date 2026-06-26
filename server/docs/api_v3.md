# POST /checkouts

장바구니에서 선택된 상품으로 결제 전 임시 주문을 생성한다.

```http
POST /checkouts
Content-Type: application/json
```

## Request

### Request Body

```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```

| 필드               | 타입   | 필수 | 설명                      |
| ------------------ | ------ | ---: | ------------------------- |
| items              | array  |    O | 주문할 상품 목록          |
| items[].product_id | number |    O | 상품 id                   |
| items[].quantity   | number |    O | 주문 수량. 1 이상 99 이하 |

## Response

### 201 Created

```json
{
  "checkout_id": 1
}
```

### 400 Bad Request

수량이 1 이상 99 이하가 아닌 경우

```json
{ "error": "INVALID_QUANTITY", "message": "수량은 1 이상 99 이하이어야 합니다." }
```

재고보다 많은 수량을 주문하려는 경우

```json
{ "error": "OUT_OF_STOCK", "message": "요청한 수량이 현재 재고보다 많습니다." }
```

### 404 Not Found

존재하지 않는 상품을 주문하려는 경우

```json
{ "error": "PRODUCT_NOT_FOUND", "message": "요청한 상품을 찾을 수 없습니다." }
```

장바구니에 존재하지 않는 상품을 주문하려는 경우

```json
{ "error": "CART_ITEM_NOT_FOUND", "message": "장바구니 상품을 찾을 수 없습니다." }
```

---

# GET /checkouts/:checkoutId

결제를 위한 임시 주문 정보를 조회한다. 주문 확인 페이지의 SSOT이다.

```http
GET /checkouts/:checkoutId
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

## Response

### 200 OK

```json
{
  "checkout_id": 1,
  "items": [
    {
      "product_id": 1,
      "name": "제품 이름",
      "price": 10000,
      "quantity": 2,
      "image_url": "https://xxx..."
    }
  ],
  "coupons": [
    {
      "coupon_id": 1,
      "name": "5,000원 할인 쿠폰",
      "expired_date": "2026-12-31",
      "min_order_amount": 50000,
      "usable_start_at": "04:00",
      "usable_end_at": "07:00",
      "is_selected": true,
      "disabled": false
    }
  ],
  "remote_area": false,
  "checkout_amount": 20000,
  "coupon_discount": 5000,
  "shipping_fee": 3000,
  "total_amount": 18000
}
```

| 필드            | 타입    | 설명                       |
| --------------- | ------- | -------------------------- |
| checkout_id     | number  | 임시 주문 id               |
| items           | array   | 주문 상품 목록             |
| coupons         | array   | 쿠폰 목록과 선택 가능 상태 |
| remote_area     | boolean | 제주도/도서산간 여부       |
| checkout_amount | number  | 상품 주문 금액             |
| coupon_discount | number  | 쿠폰 할인 금액             |
| shipping_fee    | number  | 배송비                     |
| total_amount    | number  | 최종 결제 금액             |

| coupons 필드     | 타입    | 설명                              |
| ---------------- | ------- | --------------------------------- |
| coupon_id        | number  | 쿠폰 id                           |
| name             | string  | 쿠폰 이름                         |
| expired_date     | string  | 만료일. `YYYY-MM-DD`              |
| min_order_amount | number  | 최소 주문 금액                    |
| usable_start_at  | string  | 사용 가능 시작 시간. `HH:mm`      |
| usable_end_at    | string  | 사용 가능 종료 시간. `HH:mm`      |
| is_selected      | boolean | 현재 주문에 적용되어 있는지 여부  |
| disabled         | boolean | 현재 주문 조건에서 선택 불가 여부 |

### 404 Not Found

```json
{ "error": "CHECKOUT_NOT_FOUND", "message": "주문을 찾을 수 없습니다." }
```

---

# DELETE /checkouts/:checkoutId

주문 확인 페이지에서 이탈할 때 임시 주문을 삭제한다.

```http
DELETE /checkouts/:checkoutId
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

## Response

### 204 No Content

임시 주문 삭제 성공. 반환할 데이터 없음.

### 404 Not Found

```json
{ "error": "CHECKOUT_NOT_FOUND", "message": "주문을 찾을 수 없습니다." }
```

---

# PATCH /checkouts/:checkoutId/address

주문의 제주도/도서산간 여부를 수정한다. 수정 후 클라이언트는 주문 조회 API를 다시 호출해 파생 금액을 동기화한다.

```http
PATCH /checkouts/:checkoutId/address
Content-Type: application/json
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

### Request Body

```json
{
  "remote_area": true
}
```

| 필드        | 타입    | 필수 | 설명                 |
| ----------- | ------- | ---: | -------------------- |
| remote_area | boolean |    O | 제주도/도서산간 여부 |

## Response

### 204 No Content

배송 정보 수정 성공. 반환할 데이터 없음.

### 404 Not Found

```json
{ "error": "CHECKOUT_NOT_FOUND", "message": "주문을 찾을 수 없습니다." }
```

---

# PATCH /checkouts/:checkoutId/coupons

유저가 선택한 쿠폰 조합을 주문에 적용한다. 쿠폰은 최대 2개까지 적용할 수 있다.

```http
PATCH /checkouts/:checkoutId/coupons
Content-Type: application/json
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

### Request Body

```json
{
  "coupons": [1, 2]
}
```

| 필드    | 타입             | 필수 | 설명                                               |
| ------- | ---------------- | ---: | -------------------------------------------------- |
| coupons | number[] \| null |    O | 적용할 쿠폰 id 목록. 전체 해제 시 `null`을 보낸다. |

## Response

### 204 No Content

쿠폰 적용 성공. 반환할 데이터 없음.

### 400 Bad Request

쿠폰 조건을 만족하지 못한 경우

```json
{ "error": "INVALID_COUPON_CONDITION", "message": "쿠폰 사용 조건을 만족하지 않습니다." }
```

### 404 Not Found

존재하지 않는 주문인 경우

```json
{ "error": "CHECKOUT_NOT_FOUND", "message": "주문을 찾을 수 없습니다." }
```

존재하지 않는 쿠폰을 사용한 경우

```json
{ "error": "COUPON_NOT_FOUND", "message": "쿠폰을 찾을 수 없습니다." }
```

---

# GET /checkouts/:checkoutId/coupons/discount-preview

선택한 쿠폰 조합으로 예상 쿠폰 할인 금액을 계산한다.

```http
GET /checkouts/:checkoutId/coupons/discount-preview?couponIds=1&couponIds=2
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

### Query String

| 이름      | 타입     | 필수 | 설명                    |
| --------- | -------- | ---: | ----------------------- |
| couponIds | number[] |    X | 할인액을 계산할 쿠폰 id |

## Response

### 200 OK

```json
{
  "coupon_discount": 5000
}
```

### 400 Bad Request

쿠폰 조건을 만족하지 못한 경우

```json
{ "error": "INVALID_COUPON_CONDITION", "message": "쿠폰 사용 조건을 만족하지 않습니다." }
```

### 404 Not Found

```json
{ "error": "COUPON_NOT_FOUND", "message": "쿠폰을 찾을 수 없습니다." }
```

---

# POST /checkouts/:checkoutId/payment

선택된 쿠폰과 배송 정보로 최종 결제를 처리한다.

```http
POST /checkouts/:checkoutId/payment
Content-Type: application/json
```

## Request

### Path Variable

| 이름       | 타입   | 필수 | 설명         |
| ---------- | ------ | ---: | ------------ |
| checkoutId | number |    O | 임시 주문 id |

### Request Body

```json
{
  "remote_area": false,
  "coupons": [1, 2]
}
```

| 필드        | 타입             | 필수 | 설명                                                 |
| ----------- | ---------------- | ---: | ---------------------------------------------------- |
| remote_area | boolean          |    O | 제주도/도서산간 여부                                 |
| coupons     | number[] \| null |    O | 최종 결제에 적용할 쿠폰 id 목록. 전체 해제 시 `null` |

## Response

### 200 OK

```json
{
  "item_count": 3,
  "total_quantity": 4,
  "total_amount": 105000
}
```

| 필드           | 타입   | 설명              |
| -------------- | ------ | ----------------- |
| item_count     | number | 주문 상품 종류 수 |
| total_quantity | number | 총 주문 수량      |
| total_amount   | number | 최종 결제 금액    |

### 400 Bad Request

쿠폰 조건을 만족하지 못한 경우

```json
{ "error": "INVALID_COUPON_CONDITION", "message": "쿠폰 사용 조건을 만족하지 않습니다." }
```

재고보다 많은 수량을 구매하려는 경우

```json
{ "error": "OUT_OF_STOCK", "message": "요청한 수량이 현재 재고보다 많습니다." }
```

### 404 Not Found

존재하지 않는 주문인 경우

```json
{ "error": "CHECKOUT_NOT_FOUND", "message": "주문을 찾을 수 없습니다." }
```

존재하지 않는 쿠폰을 사용한 경우

```json
{ "error": "COUPON_NOT_FOUND", "message": "쿠폰을 찾을 수 없습니다." }
```

존재하지 않는 상품을 구매하려는 경우

```json
{ "error": "PRODUCT_NOT_FOUND", "message": "요청한 상품을 찾을 수 없습니다." }
```
