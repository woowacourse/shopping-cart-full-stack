# API 명세서

> 📎 원본 명세 (Notion): [API 명세](https://app.notion.com/p/API-37cb4351752280dfba8bf4d53f8d2a28?source=copy_link)

## 📌 공통 상태 코드 (Status Code)

| Code  | 설명                                                         |
| ----- | ------------------------------------------------------------ |
| `200` | 요청이 성공적으로 이루어진 경우 (GET / PATCH)                |
| `201` | POST 요청이 성공적으로 이루어져 새로운 데이터가 생성된 경우  |
| `204` | DELETE 요청이 성공적으로 이루어진 경우 (반환값 없음)         |
| `400` | 클라이언트의 요청이 유효하지 않은 대부분의 경우              |
| `404` | 엔드포인트가 잘못된 경우, 쿼리 파라미터가 존재하지 않는 경우 |
| `500` | 서버 자체 에러                                               |

---

## 상품 (Products)

### 1. 상품 조회

**Method**: `GET`

**Path**: `/products`

**Request Body**

없음

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "products": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "quantity": 10
      },
      {
        "id": 2,
        "name": "아디다스 신발",
        "price": 50000,
        "imgUrl": "https://sdasd.asdas.com",
        "quantity": 20
      }
    ]
  }
}
```

---

### 2. 상품 추가

**Method**: `POST`

**Path**: `/products`

**Request Body**

```json
{
  "name": "아디다스 양말",
  "price": 13000,
  "imgUrl": "https://image-url.com",
  "quantity": 2
}
```

**Response `201`**

```json
{
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "id": 1
  }
}
```

**Response `400`**

```json
{ "code": "PRODUCT_NAME_LENGTH_EXCEEDED", "message": "상품명은 100자를 초과할 수 없습니다." }
```

```json
{ "code": "INVALID_PRODUCT_PRICE_TYPE", "message": "가격은 0보다 큰 숫자여야 합니다." }
```

```json
{ "code": "INVALID_PRODUCT_QUANTITY_RANGE", "message": "상품 재고는 1이상 99이하의 정수이어야 합니다." }
```

```json
{ "code": "EMPTY_PRODUCT_NAME", "message": "상품명 필드가 누락되었습니다." }
```

```json
{ "code": "EMPTY_PRODUCT_PRICE", "message": "가격 필드가 누락되었습니다." }
```

```json
{ "code": "EMPTY_PRODUCT_QUANTITY", "message": "상품 재고 필드가 누락되었습니다." }
```

---

### 3. 상품 삭제

**Method**: `DELETE`

**Path**: `/products/{id}`

**Request Body**

없음

**Response `204`**

```
204 No Content
```

**Response `404`**

```json
{ "code": "PRODUCT_NOT_EXIST", "message": "삭제하려는 상품이 존재하지 않습니다." }
```

---

## 장바구니 (Carts)

### 1. 장바구니 상품 조회

**Method**: `GET`

**Path**: `/carts`

**Request Body**

없음

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "cartItems": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "orderCount": 3,
        "isSelected": true
      },
      {
        "id": 2,
        "name": "아디다스 신발",
        "price": 50000,
        "imgUrl": "https://sdasd.asdas.com",
        "orderCount": 1,
        "isSelected": false
      }
    ]
  }
}
```

---

### 2. 장바구니 상품 추가

**Method**: `POST`

**Path**: `/carts`

**Request Body**

```json
{
  "id": 1,
  "orderCount": 2
}
```

**Response `201`**

```json
{
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "id": 1
  }
}
```

**Response `400`**

```json
{ "code": "INVALID_PRODUCT_ORDER_COUNT_TYPE", "message": "추가할 수량은 0보다 큰 숫자여야 합니다." }
```

```json
{ "code": "PRODUCT_ORDER_COUNT_EXCEEDED", "message": "보유한 상품의 개수를 넘어섰습니다." }
```

```json
{ "code": "EMPTY_PRODUCT_ORDER_COUNT", "message": "주문 수량 필드가 누락되었습니다." }
```

**Response `404`**

```json
{ "code": "PRODUCT_NOT_EXIST", "message": "수량을 추가하려는 상품이 존재하지 않습니다." }
```

---

### 3. 장바구니 상품 선택 및 수량 변경

**Method**: `PATCH`

**Path**: `/carts/{id}`

**Request Body**

`orderCount`, `isSelected` 중 변경할 필드만 전달합니다. (둘 다 전달 가능)

```json
{
  "orderCount": 3,
  "isSelected": true
}
```

**Response `200`**

```json
{
  "message": "성공적으로 변경되었습니다.",
  "result": {
    "id": 1,
    "orderCount": 3,
    "isSelected": true
  }
}
```

**Response `400`**

```json
{ "code": "INVALID_PRODUCT_ORDER_COUNT_TYPE", "message": "변경할 수량은 0보다 큰 숫자여야 합니다." }
```

```json
{ "code": "PRODUCT_ORDER_COUNT_EXCEEDED", "message": "보유한 상품의 개수를 넘어섰습니다." }
```

```json
{ "code": "EMPTY_PRODUCT_ORDER_COUNT", "message": "주문 수량 필드가 누락되었습니다." }
```

**Response `404`**

```json
{ "code": "PRODUCT_NOT_EXIST", "message": "수량을 변경하려는 상품이 존재하지 않습니다." }
```

---

### 4. 장바구니 상품 삭제

**Method**: `DELETE`

**Path**: `/carts/{id}`

**Request Body**

없음

**Response `204`**

```
204 No Content
```

**Response `404`**

```json
{ "code": "PRODUCT_NOT_EXIST_IN_CART", "message": "삭제하려는 상품이 장바구니에 존재하지 않습니다." }
```

---

### 5. 결제 금액 정보 조회

선택(`isSelected: true`)된 장바구니 상품을 기준으로 결제 금액 정보를 조회합니다.

**Method**: `GET`

**Path**: `/carts/payment`

**Request Body**

없음

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "orderPrice": 15000,
    "shippingFee": 3000,
    "totalPrice": 18000
  }
}
```

> `shippingFee`: 주문 금액이 `100,000`원 이상이면 `0`, 미만이면 `3,000`원
> `totalPrice`: `orderPrice + shippingFee`

---

## 주문 (Orders)

### 1. 주문 생성

선택한 장바구니 상품으로 주문을 생성합니다.

**Method**: `POST`

**Path**: `/orders`

**Request Body**

```json
{
  "selectedProducts": [
    { "id": 1, "orderCount": 3 },
    { "id": 2, "orderCount": 1 }
  ]
}
```

**Response `201`**

```json
{
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "id": 1
  }
}
```

**Response `400`**

```json
{ "code": "EMPTY_SELECTED_PRODUCTS", "message": "주문할 상품이 선택되지 않았습니다." }
```

**Response `404`**

```json
{ "code": "PRODUCT_NOT_EXIST", "message": "주문하려는 상품이 존재하지 않습니다." }
```

---

### 2. 주문 정보 조회

**Method**: `GET`

**Path**: `/orders/{id}`

**Request Body**

없음

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "id": 1,
    "isRemoteArea": false,
    "products": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "orderCount": 3
      }
    ],
    "payment": {
      "orderPrice": 15000,
      "shippingFee": 3000,
      "discountAmount": 0,
      "totalPrice": 18000
    }
  }
}
```

> `isRemoteArea`: 제주/도서산간 지역 배송 여부
> `payment`: 할인(`discountAmount`)을 포함한 최종 결제 금액 정보
> `totalPrice`: `orderPrice + shippingFee - discountAmount`

**Response `404`**

```json
{ "code": "ORDER_NOT_EXIST", "message": "조회하려는 주문이 존재하지 않습니다." }
```

---

### 3. 주문 정보 업데이트

배송 지역 등 주문 정보를 업데이트합니다.

**Method**: `PATCH`

**Path**: `/orders/{id}`

**Request Body**

```json
{
  "isRemoteArea": true
}
```

**Response `200`**

```json
{
  "message": "성공적으로 변경되었습니다.",
  "result": {
    "id": 1,
    "isRemoteArea": true
  }
}
```

**Response `404`**

```json
{ "code": "ORDER_NOT_EXIST", "message": "변경하려는 주문이 존재하지 않습니다." }
```

---

### 4. 주문 쿠폰 목록 조회

해당 주문에 적용 가능한 쿠폰 목록을 조회합니다.

**Method**: `GET`

**Path**: `/orders/{id}/coupons`

> **🧩 설계 근거**
>
> 클라이언트에서 쿠폰 사용 가능 여부(`isSelected`, `isDisabled`)를 직접 계산하지 않기 위해
> 쿠폰 조회 API의 엔드포인트를 `order`의 하위 리소스(`/orders/{id}/coupons`)로 설계했다.
>
> 쿠폰의 사용 가능 여부는 해당 주문의 금액(`minOrderAmount`)·시간대(`availableTime`) 등
> 주문 컨텍스트에 의존하므로, 관련 계산 로직을 모두 백엔드로 위임한다.
> 클라이언트는 응답으로 내려온 `isDisabled` 값만 보고 UI를 렌더링하면 된다.

**Request Body**

없음

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "coupons": [
      {
        "id": 1,
        "name": "2개 구매 시 1개 무료 쿠폰",
        "isSelected": false,
        "isDisabled": false,
        "dueDate": "2026-07-11",
        "minOrderAmount": 100000,
        "availableTime": {
          "startTime": "",
          "endTime": ""
        }
      }
    ]
  }
}
```

> `isSelected`: 현재 주문에 적용 중인 쿠폰 여부
> `isDisabled`: 적용 조건(`minOrderAmount`, `availableTime`, `dueDate`)을 만족하지 못해 선택 불가능한 쿠폰 여부
> `minOrderAmount`: 쿠폰 사용을 위한 최소 주문 금액
> `availableTime`: 쿠폰 사용 가능 시간대 (비어 있으면 시간 제약 없음)

**Response `404`**

```json
{ "code": "ORDER_NOT_EXIST", "message": "조회하려는 주문이 존재하지 않습니다." }
```

---

### 5. 할인 금액 계산 요청

선택한 쿠폰들을 적용했을 때의 할인 금액을 미리 계산합니다. (쿠폰은 최대 2개까지 선택 가능)

**Method**: `POST`

**Path**: `/orders/{id}/coupons/discount`

**Request Body**

```json
{
  "coupons": [1, 2]
}
```

**Response `200`**

```json
{
  "message": "요청에 성공했습니다.",
  "result": {
    "discountAmount": 6000
  }
}
```

**Response `400`**

```json
{ "code": "COUPON_SELECTION_EXCEEDED", "message": "쿠폰은 최대 2개까지 선택할 수 있습니다." }
```

```json
{ "code": "COUPON_NOT_APPLICABLE", "message": "적용할 수 없는 쿠폰이 포함되어 있습니다." }
```

**Response `404`**

```json
{ "code": "ORDER_NOT_EXIST", "message": "조회하려는 주문이 존재하지 않습니다." }
```

```json
{ "code": "COUPON_NOT_EXIST", "message": "적용하려는 쿠폰이 존재하지 않습니다." }
```

---

### 6. 주문 쿠폰 업데이트

주문에 적용할 쿠폰을 업데이트합니다. (쿠폰은 최대 2개까지 선택 가능)

**Method**: `PATCH`

**Path**: `/orders/{id}/coupons`

**Request Body**

```json
{
  "coupons": [1, 2]
}
```

**Response `200`**

```json
{
  "message": "성공적으로 변경되었습니다.",
  "result": {
    "id": 1,
    "coupons": [1, 2]
  }
}
```

**Response `400`**

```json
{ "code": "COUPON_SELECTION_EXCEEDED", "message": "쿠폰은 최대 2개까지 선택할 수 있습니다." }
```

```json
{ "code": "COUPON_NOT_APPLICABLE", "message": "적용할 수 없는 쿠폰이 포함되어 있습니다." }
```

**Response `404`**

```json
{ "code": "ORDER_NOT_EXIST", "message": "변경하려는 주문이 존재하지 않습니다." }
```

```json
{ "code": "COUPON_NOT_EXIST", "message": "적용하려는 쿠폰이 존재하지 않습니다." }
```
