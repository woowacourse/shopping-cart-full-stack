# API 명세서

[스프레드시트 🔗](https://docs.google.com/spreadsheets/d/1SvIxcKaGHvVGesTzHZ6CAiv-TSV1QzqqHnmkl1qRpWI/)

동시성 문제를 해결하기 위한 방법으로 order를 생성하기로 결정했습니다.

쿠폰 또한 **주문 단위**로 적용되는 쿠폰이라는 명세를 보고
`/orders`의 하위로 포함시켰습니다. 주문 기반으로 쿠폰 리스트가 추출된다면 body로 주문 정보를 길게 담아 보내기보다는 주문 id만 보내는 게 나을 것이라고 판단했고, 주문 id를 body로 담아 보내기보다는 해당 주문에 종속되는 쿠폰을 받아온다는 의미가 더 RESTful하게 느껴졌기 때문입니다.

![api_명세서.png](public/api_명세서.png)

# API 명세서

## 1. 주문 생성

- **Method:** `POST`
- **Endpoint:** `/orders`
- **설명:** 새로운 주문을 생성합니다.

### Request Body

```json
{
  "products": [
    {
      "id": "number",
      "quantity": "number"
    },
    ...
  ]
}
```

### Responses

| Status Code | Error Description | Response Body                                                                                                              |
|:------------|:------------------|:---------------------------------------------------------------------------------------------------------------------------|
| 201         | \-                | `{ "orderId": "number" }`                                                                                                  |
| 400         | 타입 불일치            | `{ "errorCode": "TYPE_MISMATCH", "errorMessage": "타입이 일치하지 않습니다." }`                                                       |
| 400         | 필수값 누락            | `{ "errorCode": "MISSING_FIELD", "errorMessage": "필수값이 누락되었습니다.", "data": [{ "type": "string", "errorCode": "string" }] }` |
| 409         | 품절된 상품 포함         | `{ "errorCode": "OUT_OF_STOCK", "errorMessage": "품절된 상품이 포함되어 있습니다." }`                                                    |

### 비고 - 상품에 예약 걸기 (재고 -1 또는 reserved + 1 등)

- 주문은 10분 동안 유효
- 할인율이 가장 높은 쿠폰을 먼저 선택해야 함

-----

## 2. 주문 조회

- **Method:** `GET`
- **Endpoint:** `/orders/:orderId`
- **설명:** 특정 주문의 상세 정보를 조회합니다.

### Path Parameters

```json
  {
  "orderId": "number"
}
```

### Responses

| Status Code | Error Description | Response Body                                                                                                                                                                                                                  |
|:------------|:------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200         | \-                | `{ "products": [ { "id": "number", "name": "string", "price": "number", "imgUrl": "string", "quantity": "number", "hasGift": "boolean" }, ... ], "coupons": "number[]", "isRemoteArea": "boolean", "deliveryFee?": "number" }` |
| 409         | 주문 만료             | `{ "errorCode": "ORDER_EXPIRED", "errorMessage": "주문이 만료되었습니다." }`                                                                                                                                                             |

### 비고

- 주문 생성 시 이미 예약을 걸었으므로 품절 이슈 없음
- 쿠폰 만료 검증은 결제 API 호출 시 수행

-----

## 3. 주문 변경

- **Method:** `PATCH`
- **Endpoint:** `/orders/:orderId`
- **설명:** 주문의 쿠폰 적용 여부나 배송지 정보(도서산간 등)를 변경합니다.

### Path Parameters

``` json
  {
  "orderId": "number"
  }
```

### Request Body

``` json
{
"couponId?": "number[]",
"isRemoteArea?": "boolean"
}
```

### Responses

| Status Code | Error Description | Response Body                                                                                                              |
|:------------|:------------------|:---------------------------------------------------------------------------------------------------------------------------|
| 200         | \-                | `{ "couponId?": "number[]", "isRemoteArea?": "boolean", "deliveryFee?": "number" }`                                        |
| 400         | 타입 불일치            | `{ "errorCode": "TYPE_MISMATCH", "errorMessage": "타입이 일치하지 않습니다." }`                                                       |
| 400         | 필수값 누락            | `{ "errorCode": "MISSING_FIELD", "errorMessage": "필수값이 누락되었습니다.", "data": [{ "type": "string", "errorCode": "string" }] }` |
| 409         | 주문 만료             | `{ "errorCode": "ORDER_EXPIRED", "errorMessage": "주문이 만료되었습니다." }`                                                         |
| 422         | 쿠폰 만료             | `{ "errorCode": "COUPON_EXPIRED", "errorMessage": "만료된 쿠폰입니다." }`                                                          |

### 비고

- 변경된 값만 응답에 포함
- 쿠폰 만료 검증을 결제 API 호출 시점으로 미룸

-----

## 4. 할인 금액 조회

- **Method:** `GET`
- **Endpoint:** `/orders/:orderId/discount`
- **설명:** 적용할 쿠폰에 따른 총 할인 금액을 계산합니다.

### Path Parameters

``` json
  {
  "orderId": "number"
  }
```

### Query Parameters

``` json
{
"couponId": "number[]"
}
```

### Responses

| Status Code | Error Description | Response Body                                                        |
|:------------|:------------------|:---------------------------------------------------------------------|
| 200         | \-                | `{ "discountAmount": "number" }`                                     |
| 400         | 타입 불일치            | `{ "errorCode": "TYPE_MISMATCH", "errorMessage": "타입이 일치하지 않습니다." }` |

### 비고

- 정액 쿠폰(FIXED5000, BOGO 등)을 먼저 적용한 후, 할인된 금액에서 정율 쿠폰(MIRACLESALE 등)을 적용하여 최종 금액 계산
- couponId가 누락된 경우 0 반환

-----

## 5. 쿠폰 정보 조회

- **Method:** `GET`
- **Endpoint:** `/orders/:orderId/coupons`
- **설명:** 해당 주문에서 사용 가능한 쿠폰 목록을 조회합니다.

### Path Parameters

``` json
  {
  "orderId": "number"
  }
```

### Responses

| Status Code | Error Description | Response Body                                                                                                                                                                |
|:------------|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200         | \-                | `{ "coupons": [ { "id": "number", "name": "string", "expirationDate": "string", "minOrderAmount?": "number", "availableHours?": "string", "isCouponUsable": "boolean" } ] }` |

### 비고 (쿠폰 정책)  - **5,000원 할인 (FIXED5000):** 최소 주문 100,000원 이상 시 적용

- **2+1 쿠폰 (BOGO):** 동일 상품 2개 구매 시 1개 무료. 단가가 가장 높은 상품에 적용하며 할인 금액에는 포함하지 않음 (다른 쿠폰과 중복 가능)
- **무료 배송 (FREESHIPPING):** 최소 주문 50,000원 이상 시 도서산간 추가 배송비 포함 면제
- **30% 시간제 할인 (MIRACLESALE):** 오전 4시 \~ 7시 사이에만 적용 가능
