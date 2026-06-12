# 장바구니 3단계 API 명세

## 개요

| Category | Method | Endpoint | Success | Error | 설명 |
| --- | --- | --- | --- | --- | --- |
| preorder | POST | `/preorder` | 201 | 400 | 선택된 장바구니 항목으로 임시 주문서를 생성한다. |
| preorder | GET | `/preorder/:preorderId` | 200 | 404 | 임시 주문서의 상품 정보를 조회한다. |
| coupons | GET | `/coupons?preorderId={preorderId}` | 200 | 404 | 임시 주문 기준으로 쿠폰 목록과 사용 가능 여부를 조회한다. |
| order | POST | `/order` | 201 | 400, 409 | 클라이언트의 예상 결제 금액과 주문 정보를 검증한 뒤 주문을 생성한다. |
| order | GET | `/order/:orderId` | 200 | 404 | 주문 요약 정보를 조회한다. |

## 공통 규칙

- 요청과 응답 본문은 JSON 형식을 사용한다.
- 쿠폰 등록, 수정, 삭제 API는 제공하지 않는다.
- 쿠폰 데이터는 DB에 하드코딩된 초기 데이터로 관리한다.
- 결제 금액의 원천 계산은 서버가 담당한다.
- 프론트엔드가 전달하는 예상 금액은 무결성 비교용이며, 서버는 해당 값을 신뢰하지 않는다.
- 서버는 쿠폰 유효성, 서버 시간, 임시 주문 데이터, 최신 상품/재고 데이터를 기준으로 주문을 검증한다.

## Preorder

### POST `/preorder`

프론트에서 선택된 장바구니 ID 리스트를 보내면, DB에서 해당 cart ID에 저장되어 있는 `productId`와 `quantity`를 불러온다. 이후 `productId`를 기반으로 상품 정보를 조회하고, 캐시의 preorder 테이블에 저장한다.

### Request Body

```json
{
  "selectedCartIds": ["string"]
}
```

### Request Example

```json
{
  "selectedCartIds": ["1", "3", "8"]
}
```

### Response

```json
{
  "preorderId": "string"
}
```

### Response Example

```json
{
  "preorderId": "8400-e29b4-00"
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 201 | preorder 생성 성공 |
| 400 | request body의 `selectedCartIds`가 유효하지 않음 |

---

### GET `/preorder/:preorderId`

캐시에 저장된 preorder 정보인 `productId`, `quantity`, 상품 이름, 상품 가격, 상품 섬네일을 조회한다.

### Request

없음

### Response

```json
{
  "preorderId": "string",
  "items": [
    {
      "productId": "string",
      "price": "number",
      "name": "string",
      "thumbnail": "string",
      "quantity": "number"
    }
  ]
}
```

### Response Example

```json
{
  "preorderId": "8400-e29b4-00",
  "items": [
    {
      "productId": "11001123",
      "price": 35000,
      "name": "무지 반팔티",
      "thumbnail": "https://test.s3/products/tee.png",
      "quantity": 2
    }
  ]
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | preorder 조회 성공 |
| 404 | `preorderId`가 유효하지 않음 |

---

## Coupons

### GET `/coupons?preorderId={preorderId}`

coupon DB에 저장된 쿠폰 ID, 쿠폰 이름, 쿠폰 타입, 쿠폰 만료일, 쿠폰 condition, 쿠폰 benefit을 조회한다. 백엔드에서 쿠폰 적용 가능 여부를 계산하여 `disabled` 상태를 함께 전달해야 한다.

### Query Parameters

| Name | Type | Required | 설명 |
|---|---|---:|---|
| preorderId | string | Yes | 쿠폰 적용 가능 여부를 계산할 preorder ID |

### Response

```json
{
  "coupons": [
    {
      "couponId": "number",
      "name": "string",
      "type": "FIXED" | "RATE",
      "expirationDate": "string",
      "condition": "object",
      "benefit": "object",
      "disabled": "boolean"
    }
  ]
}
```

### Response Example

```json
{
  "coupons": [
    {
      "couponId": 1,
      "name": "5000원 할인 쿠폰",
      "type": "FIXED",
      "expirationDate": "2026-06-12",
      "condition": {
        "minOrderAmount": 100000
      },
      "benefit": {
        "discountAmount": 5000
      },
      "disabled": false
    }
  ]
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | 쿠폰 목록 조회 성공 |
| 404 | `preorderId`가 유효하지 않음 |

---

## Order

### POST `/order`

클라이언트에서 계산을 완료한 뒤, 클라이언트의 예상 결제 금액과 금액에 영향을 끼치는 요소를 백엔드로 보낸다.

금액에 영향을 끼치는 요소는 다음과 같다.

- `preorderId`
- `quantity`
- `isRemoteArea`
- `couponIds`

백엔드는 주문 요청을 검증하고, 성공한 경우 `orderId`를 반환한다.

### Request Body

```json
{
  "preorderId": "string",
  "isRemoteArea": "boolean",
  "couponIds": ["number"],
  "expectedPrice": {
    "orderAmount": "number",
    "discountAmount": "number",
    "shippingFee": "number",
    "totalPaymentAmount": "number"
  }
}
```

### Request Example

```json
{
  "preorderId": "8400-e29b4-00",
  "isRemoteArea": true,
  "couponIds": [1],
  "expectedPrice": {
    "orderAmount": 70000,
    "discountAmount": 5000,
    "shippingFee": 6000,
    "totalPaymentAmount": 71000
  }
}
```

### Response

```json
{
  "orderId": "string"
}
```

### Response Example

```json
{
  "orderId": "00-11-aa-bb"
}
```

### Error Response Example

```json
{
  "message": "string"
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 201 | 주문 생성 성공 |
| 400 | 요청 값이 유효하지 않음. 실패 이유를 `message`로 전달 |
| 409 | Conflict. 예: 백엔드에서 재계산한 결제 금액과 클라이언트의 `expectedPrice`가 일치하지 않음 |

---

### GET `/order/:orderId`

주문 ID를 기반으로 주문 요약 정보를 조회한다.

### Request

없음

### Response

```json
{
  "itemCount": "number",
  "totalQuantity": "number",
  "totalAmount": "number"
}
```

### Response Example

```json
{
  "itemCount": 1,
  "totalQuantity": 2,
  "totalAmount": 100000
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | 주문 요약 조회 성공 |
| 404 | `orderId`가 유효하지 않음 |
