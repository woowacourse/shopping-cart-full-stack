# API 명세서

---

## 임시 영수증 (Checkout)

### 1. 주문확인 임시 영수증 발행

- **Method**: `POST`
- **Path**: `/checkout`

**Request Body**

```json
{
  "cartId": 1,
  "selectedProductIds": [1, 2, 3, 4]
}
```

**Response `201`**

```json
{
  "code": 201,
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "checkoutId": 1
  }
}
```

**Response `400`**

```json
{
  "code": "EMPTY_SELECTED_PRODUCT_IDS",
  "message": "선택한 상품 목록 필드가 누락되었습니다."
}
```

```json
{
  "code": "INVALID_SELECTED_PRODUCT_IDS_TYPE",
  "message": "선택한 상품 목록은 배열이어야 합니다."
}
```

```json
{
  "code": "EMPTY_SELECTED_PRODUCT_IDS_LIST",
  "message": "선택한 상품이 없습니다."
}
```

```json
{
  "code": "INVALID_SELECTED_PRODUCT_ID_TYPE",
  "message": "선택한 상품 id는 숫자여야 합니다."
}
```

**Response `404`**

```json
{
  "code": "PRODUCT_NOT_EXIST_IN_CART",
  "message": "해당 상품이 장바구니에 존재하지 않습니다."
}
```

```json
{
  "code": "CART_NOT_EXIST",
  "message": "장바구니가 존재하지 않습니다."
}
```

---

### 2. 임시 영수증 조회

- **Method**: `GET`
- **Path**: `/checkout/{checkoutId}`

**Request Body**

필요 없음

**Response `200`**

```json
{
  "code": 200,
  "message": "요청에 성공했습니다.",
  "result": {
    "checkoutId": 1,
    "checkoutItems": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "itemCount": 3
      },
      {
        "id": 2,
        "name": "아디다스 신발",
        "price": 50000,
        "imgUrl": "https://sdasd.asdas.com",
        "itemCount": 1
      }
    ],
    "appliedCouponIds": [],
    "remoteArea": false,
    "orderPrice": 55000,
    "couponDiscountPrice": 0,
    "deliveryFee": 3000,
    "totalPrice": 58000
  }
}
```

**Response `404`**

```json
{
  "code": "CHECKOUT_NOT_FOUND",
  "message": "임시 영수증이 존재하지 않습니다."
}
```

---

### 3. 영수증 쿠폰 조회

- **Method**: `GET`
- **Path**: `/checkout/{checkoutId}/coupons`

**Request Body**

**Response `200`**

```json
{
  "code": 200,
  "message": "요청에 성공했습니다.",
  "result": {
    "coupons": [
      {
        "id": 1,
        "name": "5,000원 할인 쿠폰",
        "type": "FIXED5000",
        "expiryDate": "2026-11-30",
        "fixedDiscountPrice": 5000,
        "fixedDiscountRate": null,
        "minAmount": 100000,
        "startTime": null,
        "endTime": null,
        "isAvailable": true
      },
      {
        "id": 2,
        "name": "2+1 쿠폰",
        "type": "BOGO",
        "expiryDate": "2026-06-30",
        "fixedDiscountPrice": null,
        "fixedDiscountRate": null,
        "minAmount": null,
        "startTime": null,
        "endTime": null,
        "isAvailable": true
      },
      {
        "id": 3,
        "name": "무료 배송 쿠폰",
        "type": "FREESHIPPING",
        "expiryDate": "2026-08-31",
        "fixedDiscountPrice": null,
        "fixedDiscountRate": null,
        "minAmount": 50000,
        "startTime": null,
        "endTime": null,
        "isAvailable": false
      },
      {
        "id": 4,
        "name": "30% 시간제 할인 쿠폰",
        "type": "MIRACLESALE",
        "expiryDate": "2026-07-31",
        "fixedDiscountPrice": null,
        "fixedDiscountRate": 30,
        "minAmount": null,
        "startTime": "04:00",
        "endTime": "07:00",
        "isAvailable": true
      }
    ],
    "recommendedCouponIds": [1, 4]
  }
}
```

**Response `404`**

```json
{
  "code": "CHECKOUT_NOT_FOUND",
  "message": "임시 영수증이 존재하지 않습니다."
}
```

API 근거: 이미 영수증을 백엔드에 만들어 놓았기 때문에 백엔드가 쿠폰 할인 금액과 사용가능여부를 계산할 수 있다.
recommendedCouponIds는 클라이언트의 최초 선택 상태를 위한 추천값이며, 임시 영수증에는 사용하기 버튼을 클릭했을 때 적용된다.

---

### 4. 임시 영수증 쿠폰 적용

- **Method**: `PATCH`
- **Path**: `/checkout/{checkoutId}/coupons`

**Request Body**

```json
{
  "couponIds": [1, 2]
}
```

**Response `200`**

```json
{
  "code": 200,
  "message": "쿠폰이 적용되었습니다.",
  "result": {
    "appliedCouponIds": [1, 2],
    "couponDiscountPrice": 0,
    "deliveryFee": 3000,
    "totalPrice": 58000
  }
}
```

**Response `400`**

```json
{
  "code": "COUPON_APPLY_COUNT_EXCEEDED",
  "message": "쿠폰은 2개까지 사용하실 수 있습니다."
}
```

```json
{
  "code": "UNAVIALABLE_COUPON_EXIST",
  "message": "사용 불가능한 쿠폰이 존재합니다."
}
```

**Response `404`**

```json
{
  "code": "COUPON_NOT_FOUND",
  "message": "해당 쿠폰이 존재하지 않습니다."
}
```

```json
{
  "code": "CHECKOUT_NOT_FOUND",
  "message": "임시 영수증이 존재하지 않습니다."
}
```

---

### 5. 도서산간 토글

- **Method**: `PATCH`
- **Path**: `/checkout/{checkoutId}/remote-area`

**Request Body**

```json
{
  "remoteArea": true
}
```

**Response `200`**

```json
{
  "code": 200,
  "message": "요청에 성공했습니다.",
  "result": {
    "remoteArea": true,
    "deliveryFee": 6000,
    "couponDiscountPrice": 0,
    "totalPrice": 61000
  }
}
```

**Response `404`**

```json
{
  "code": "CHECKOUT_NOT_FOUND",
  "message": "임시 영수증이 존재하지 않습니다."
}
```

---

### 6. 쿠폰 유효성 검증 (결제할 때)

- **Method**: `POST`
- **Path**: `/checkout/{checkoutId}/coupons/validation`

**Response `200`**

```json
{
  "code": 200,
  "message": "올바른 쿠폰입니다.",
  "result": {
    "valid": true
  }
}
```

**Response `400`**

```json
{
  "code": "UNAVIALABLE_COUPON_EXIST",
  "message": "사용 불가능한 쿠폰이 존재합니다."
}
```

```json
{
  "code": "COUPON_APPLY_COUNT_EXCEEDED",
  "message": "쿠폰은 2개까지 사용하실 수 있습니다."
}
```

**Response `404`**

```json
{
  "code": "CHECKOUT_NOT_FOUND",
  "message": "임시 영수증이 존재하지 않습니다."
}
```

```json
{
  "code": "COUPON_NOT_FOUND",
  "message": "해당 쿠폰이 존재하지 않습니다."
}
```

API 근거: 해당 API는 "결제하기" 버튼을 클릭했을 때 사용된다. 유효한 쿠폰인지 검증하는 것을 결제할 때 하는 이유는 결제 시점을 기준으로 해당 쿠폰을 사용하기 위함이다.

---
