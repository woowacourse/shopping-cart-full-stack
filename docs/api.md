# 장바구니 3단계 API 명세

## 개요

| Category | Method | Endpoint | Success | Error | 설명 |
| --- | --- | --- | --- | --- | --- |
| preorder | POST | `/preorder` | 201 | 400 | 선택된 장바구니 항목으로 임시 주문서를 생성한다. |
| preorder | GET | `/preorder/:preorderId` | 200 | 404 | 임시 주문서의 상품 정보를 조회한다. |
| coupons | GET | `/coupons?preorderId={preorderId}` | 200 | 404 | 임시 주문 기준으로 쿠폰 목록과 사용 가능 여부를 조회한다. |
| order | POST | `/order/preview` | 200 | 400, 404 | 쿠폰과 배송지 조건을 기준으로 결제 예상 금액을 계산한다. |
| order | POST | `/order` | 201 | 400, 404, 409 | 클라이언트가 동의한 최종 결제 금액과 주문 정보를 검증한 뒤 주문을 생성한다. |
| order | GET | `/order/:orderId` | 200 | 404 | 주문 요약 정보를 조회한다. |

## 공통 규칙

- 요청과 응답 본문은 JSON 형식을 사용한다.
- 성공 응답과 에러 응답은 모두 최상위 `body` 필드로 실제 응답 데이터를 감싼다.
- 에러 응답은 `{ "body": { "message": "string" } }` 형식으로 실패 이유를 전달한다.
- 쿠폰 데이터는 DB에 하드코딩된 초기 데이터로 관리하며, 쿠폰 등록/수정/삭제 API는 제공하지 않는다.
- 결제 금액 계산과 주문 생성 검증은 서버가 전담하며, 프론트엔드는 서버 계산 결과를 화면에 표시한다.
- 주문 확인 단계의 preorder는 서버 인메모리 Map 기반 PreorderStore에 TTL과 함께 저장한다.
- PreorderStore에서 preorder를 찾을 수 없는 경우 TTL 만료 또는 서버 재시작으로 사라진 상태와 동일하게 처리한다.

## Preorder

### POST `/preorder`

프론트에서 선택된 장바구니 ID 리스트를 보내면, 서버는 DB에서 해당 cart ID에 저장되어 있는 `productId`와 `quantity`를 조회한다. 이후 `productId`를 기반으로 최신 상품 정보를 조회하고, 장바구니와 확정 주문 사이에서 사용할 짧은 생명주기의 주문 세션인 preorder를 생성한다.

preorder는 주문 확인, 쿠폰 조회, 결제 금액 미리보기, 주문 생성 API가 공유하는 기준 데이터다. 서버 인메모리 Map 기반 PreorderStore에 만료 시각과 함께 저장한다. 주문 생성 성공 시 한 번만 소비되어 삭제되며, TTL이 만료되거나 서버 재시작으로 사라지면 사용자는 장바구니에서 주문 확인 흐름을 다시 시작해야 한다.

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
  "body": {
    "preorderId": "string"
  }
}
```

### Response Example

```json
{
  "body": {
    "preorderId": "8400-e29b4-00"
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 201 | preorder 생성 성공 |
| 400 | request body의 `selectedCartIds`가 유효하지 않음 |

---

### GET `/preorder/:preorderId`

preorder 주문 세션에 저장된 `productId`, `quantity`, 상품 이름, 상품 가격, 상품 섬네일을 조회한다.

### Request

없음

### Response

```json
{
  "body": {
    "preorderId": "string",
    "items": [
      {
        "productId": "string",
        "price": "number",
        "name": "string",
        "imageUrl": "string",
        "quantity": "number"
      }
    ]
  }
}
```

### Response Example

```json
{
  "body": {
    "preorderId": "8400-e29b4-00",
    "items": [
      {
        "productId": "11001123",
        "price": 35000,
        "name": "무지 반팔티",
        "imageUrl": "https://test.s3/products/tee.png",
        "quantity": 2
      }
    ]
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | preorder 조회 성공 |
| 404 | `preorderId`가 유효하지 않거나, TTL 만료 또는 서버 재시작으로 preorder를 찾을 수 없음 |

---

## Coupons

### GET `/coupons?preorderId={preorderId}`

coupon DB에 저장된 쿠폰 ID, 쿠폰 코드, 쿠폰 이름, 쿠폰 만료일, 쿠폰 condition, 쿠폰 benefit을 조회한다. 서버에서 쿠폰 적용 가능 여부를 계산하여 `disabled`와 `disabledReason`을 함께 전달해야 한다.

### Query Parameters

| Name | Type | Required | 설명 |
|---|---|---:|---|
| preorderId | string | Yes | 쿠폰 적용 가능 여부를 계산할 preorder ID |

### Response

```json
{
  "body": {
    "coupons": [
      {
        "couponId": "number",
        "code": "string",
        "name": "string",
        "expirationDate": "ISO 8601 datetime string",
        "condition": "object",
        "benefit": "object",
        "disabled": "boolean",
        "disabledReason": "string | null"
      }
    ]
  }
}
```

### Coupon Condition / Benefit

현재 단계의 쿠폰은 고정된 정책을 가진다. 최상위 `code`는 쿠폰을 식별하는 문자열이며, `target`은 적용 대상, `rule`은 해석할 정책 이름, `params`는 정책 계산에 필요한 값을 나타낸다. 상품 할인 혜택은 `discountType`으로 정액성 할인과 정율 할인을 구분한다.

| Code | condition | benefit |
| --- | --- | --- |
| `FIXED5000` | `{ "target": "ORDER", "rule": "MIN_ORDER_AMOUNT", "params": { "minOrderAmount": 100000 } }` | `{ "target": "PRODUCT", "discountType": "FIXED", "rule": "DISCOUNT_AMOUNT", "params": { "discountAmount": 5000 } }` |
| `BOGO` | `{ "target": "PRODUCT", "rule": "MIN_SAME_PRODUCT_QUANTITY", "params": { "minSameProductQuantity": 2 } }` | `{ "target": "PRODUCT", "discountType": "FIXED", "rule": "DISCOUNT_HIGHEST_UNIT_PRICE_ITEM", "params": { "discountQuantity": 1 } }` |
| `FREESHIPPING` | `{ "target": "ORDER", "rule": "MIN_ORDER_AMOUNT", "params": { "minOrderAmount": 50000 } }` | `{ "target": "SHIPPING", "rule": "FREE_SHIPPING", "params": {} }` |
| `MIRACLESALE` | `{ "target": "TIME", "rule": "TIME_RANGE", "params": { "start": "04:00", "end": "07:00" } }` | `{ "target": "PRODUCT", "discountType": "RATE", "rule": "DISCOUNT_RATE", "params": { "discountRate": 0.3, "applyAfterFixedDiscount": true } }` |

- `code`는 쿠폰 식별용 문자열이다. 같은 계산 방식의 쿠폰이 추가되어도 서버 계산 로직은 `condition.target`, `condition.rule`, `benefit.target`, `benefit.rule`을 기준으로 해석한다.
- `condition.target`은 조건 판단 대상을 나타낸다. `ORDER`는 주문, `PRODUCT`는 상품, `TIME`은 서버 시간 기준이다.
- `benefit.target`은 혜택 적용 대상을 나타낸다. `PRODUCT`는 상품 금액 할인, `SHIPPING`은 배송비 할인이다.
- `benefit.discountType`은 상품 할인 쿠폰의 적용 순서를 판단하는 할인 성격이다. 서버는 `FIXED` 상품 할인을 먼저 적용하고, 남은 상품 금액에 `RATE` 상품 할인을 적용한다.
- `params`에는 해당 `rule` 계산에 필요한 값을 담는다.
- `expirationDate`는 ISO 8601 datetime string으로 전달한다.
- `MIN_ORDER_AMOUNT`는 쿠폰 적용 전 주문 금액을 기준으로 판단한다.
- `MIN_SAME_PRODUCT_QUANTITY`는 동일 상품을 2개 이상 구매했는지 판단할 때 사용한다.
- `DISCOUNT_HIGHEST_UNIT_PRICE_ITEM`은 적용 가능한 상품 중 단가가 가장 높은 상품 1개를 할인 대상으로 삼는다는 의미다.
- `FREE_SHIPPING`은 기본 배송비와 제주도 및 도서산간 추가 배송비를 모두 무료 처리한다.
- `TIME_RANGE`는 서버 시간을 기준으로 판단하며, `start`는 포함하고 `end`는 포함하지 않는다.
- `DISCOUNT_RATE`의 `discountRate`는 0 이상 1 이하의 소수로 표현한다.

### Response Example

```json
{
  "body": {
    "coupons": [
      {
        "couponId": 1,
        "code": "FIXED5000",
        "name": "5000원 할인 쿠폰",
        "expirationDate": "2026-11-30T14:59:59.000Z",
        "condition": {
          "target": "ORDER",
          "rule": "MIN_ORDER_AMOUNT",
          "params": {
            "minOrderAmount": 100000
          }
        },
        "benefit": {
          "target": "PRODUCT",
          "discountType": "FIXED",
          "rule": "DISCOUNT_AMOUNT",
          "params": {
            "discountAmount": 5000
          }
        },
        "disabled": false,
        "disabledReason": null
      },
      {
        "couponId": 2,
        "code": "BOGO",
        "name": "2+1 쿠폰",
        "expirationDate": "2026-06-30T14:59:59.000Z",
        "condition": {
          "target": "PRODUCT",
          "rule": "MIN_SAME_PRODUCT_QUANTITY",
          "params": {
            "minSameProductQuantity": 2
          }
        },
        "benefit": {
          "target": "PRODUCT",
          "discountType": "FIXED",
          "rule": "DISCOUNT_HIGHEST_UNIT_PRICE_ITEM",
          "params": {
            "discountQuantity": 1
          }
        },
        "disabled": true,
        "disabledReason": "동일 상품을 2개 이상 구매해야 합니다."
      },
      {
        "couponId": 3,
        "code": "FREESHIPPING",
        "name": "무료 배송 쿠폰",
        "expirationDate": "2026-08-31T14:59:59.000Z",
        "condition": {
          "target": "ORDER",
          "rule": "MIN_ORDER_AMOUNT",
          "params": {
            "minOrderAmount": 50000
          }
        },
        "benefit": {
          "target": "SHIPPING",
          "rule": "FREE_SHIPPING",
          "params": {}
        },
        "disabled": true,
        "disabledReason": "주문 금액이 50,000원 미만입니다."
      },
      {
        "couponId": 4,
        "code": "MIRACLESALE",
        "name": "30% 시간제 할인 쿠폰",
        "expirationDate": "2026-07-31T14:59:59.000Z",
        "condition": {
          "target": "TIME",
          "rule": "TIME_RANGE",
          "params": {
            "start": "04:00",
            "end": "07:00"
          }
        },
        "benefit": {
          "target": "PRODUCT",
          "discountType": "RATE",
          "rule": "DISCOUNT_RATE",
          "params": {
            "discountRate": 0.3,
            "applyAfterFixedDiscount": true
          }
        },
        "disabled": true,
        "disabledReason": "현재 적용 가능한 시간이 아닙니다."
      }
    ]
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | 쿠폰 목록 조회 성공 |
| 400 | query parameter의 `preorderId`가 유효하지 않음 |
| 404 | `preorderId`가 유효하지 않거나, TTL 만료 또는 서버 재시작으로 preorder를 찾을 수 없음 |

---

## Order

### POST `/order/preview`

선택한 쿠폰과 배송지 조건을 기준으로 서버가 결제 예상 금액을 계산한다. 프론트엔드는 이 응답을 화면 표시용 금액과 "총 n원 할인 쿠폰 사용하기" 버튼 문구의 기준으로 사용하며, 별도의 금액 계산 로직을 갖지 않는다.

쿠폰 체크/해제 또는 제주도 및 도서산간 지역 여부 변경처럼 화면에 표시할 할인 금액이 달라질 수 있는 상호작용마다 호출한다. 제주도 및 도서산간 지역 체크 여부는 이 API 호출로 DB에 저장되지 않고, 배송비 계산 입력값으로만 사용된다.

프론트엔드는 매 요청마다 현재 선택 중인 쿠폰 ID 목록을 `couponIds`로 함께 보낸다. 선택한 쿠폰이 없으면 빈 배열을 보낸다.

요청이 성공하면 서버는 실제 적용된 쿠폰 ID 목록과 배송 조건을 PreorderStore에 저장한다. 프론트엔드는 응답의 `body.price`, `body.appliedCoupons`, `body.excludedCoupons`를 화면에 표시한다.

### Request Body

```json
{
  "preorderId": "string",
  "isRemoteArea": "boolean",
  "couponIds": ["number"]
}
```

| Field | Required | 설명 |
| --- | --- | --- |
| `preorderId` | Yes | 결제 금액을 계산할 preorder ID |
| `isRemoteArea` | Yes | 제주도 및 도서산간 지역 여부 |
| `couponIds` | Yes | 현재 선택 중인 쿠폰 ID 목록. 선택한 쿠폰이 없으면 빈 배열을 보낸다. |

### Request Example

쿠폰 체크/해제 시:

```json
{
  "preorderId": "8400-e29b4-00",
  "isRemoteArea": true,
  "couponIds": [1, 3]
}
```

배송 조건 변경 시:

```json
{
  "preorderId": "8400-e29b4-00",
  "isRemoteArea": true,
  "couponIds": [1, 3]
}
```

### Response

```json
{
  "body": {
    "price": {
      "orderAmount": "number",
      "productDiscountAmount": "number",
      "shippingDiscountAmount": "number",
      "totalDiscountAmount": "number",
      "shippingFee": "number",
      "totalPaymentAmount": "number"
    },
    "appliedCoupons": [
      {
        "couponId": "number",
        "code": "string",
        "name": "string",
        "discountAmount": "number"
      }
    ],
    "excludedCoupons": [
      {
        "couponId": "number",
        "code": "string",
        "name": "string",
        "excludedReason": "string"
      }
    ]
  }
}
```

### Response Example

```json
{
  "body": {
    "price": {
      "orderAmount": 70000,
      "productDiscountAmount": 5000,
      "shippingDiscountAmount": 6000,
      "totalDiscountAmount": 11000,
      "shippingFee": 0,
      "totalPaymentAmount": 65000
    },
    "appliedCoupons": [
      {
        "couponId": 1,
        "code": "FIXED5000",
        "name": "5000원 할인 쿠폰",
        "discountAmount": 5000
      },
      {
        "couponId": 3,
        "code": "FREESHIPPING",
        "name": "무료 배송 쿠폰",
        "discountAmount": 6000
      }
    ],
    "excludedCoupons": []
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | 결제 예상 금액 계산 성공 |
| 400 | 요청 값이 유효하지 않음 |
| 404 | `preorderId`가 유효하지 않거나, TTL 만료 또는 서버 재시작으로 preorder를 찾을 수 없음 |

---

### POST `/order`

클라이언트가 화면에서 보여준 최종 결제 금액을 서버로 보낸다. 주문 생성 요청에는 쿠폰 ID와 배송 조건을 다시 보내지 않는다. 서버는 PreorderStore에 저장된 마지막 결제 금액 미리보기의 적용 쿠폰 ID 목록과 배송 조건을 기준으로 주문 금액을 다시 계산한다.

금액에 영향을 끼치는 요소는 다음과 같다.

- `preorderId`
- `expectedTotalPaymentAmount`

서버는 주문 생성 시점에 preorder, PreorderStore의 적용 쿠폰/배송 조건, 쿠폰 정책, 서버 시간을 기준으로 결제 금액을 반드시 다시 계산한다. 프론트엔드가 보낸 `expectedTotalPaymentAmount`와 서버 재계산 결과가 일치하면 주문을 생성한다.

### Request Body

```json
{
  "preorderId": "string",
  "expectedTotalPaymentAmount": "number"
}
```

### Request Example

```json
{
  "preorderId": "8400-e29b4-00",
  "expectedTotalPaymentAmount": 71000
}
```

### Response

```json
{
  "body": {
    "orderId": "string"
  }
}
```

### Response Example

```json
{
  "body": {
    "orderId": "00-11-aa-bb"
  }
}
```

### Error Response Example

```json
{
  "body": {
    "message": "서버에서 다시 계산한 결제 금액이 화면에 표시된 금액과 일치하지 않습니다."
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 201 | 주문 생성 성공 |
| 400 | 요청 값이 유효하지 않음. 실패 이유를 `message`로 전달 |
| 404 | `preorderId`가 유효하지 않거나, TTL 만료 또는 서버 재시작으로 preorder를 찾을 수 없음 |
| 409 | Conflict. 예: 서버에서 재계산한 최종 결제 금액과 클라이언트의 `expectedTotalPaymentAmount`가 일치하지 않음 |

---

### GET `/order/:orderId`

주문 ID를 기반으로 주문 요약 정보를 조회한다.

### Request

없음

### Response

```json
{
  "body": {
    "itemCount": "number",
    "totalQuantity": "number",
    "totalAmount": "number"
  }
}
```

### Response Example

```json
{
  "body": {
    "itemCount": 1,
    "totalQuantity": 2,
    "totalAmount": 100000
  }
}
```

### Status Code

| Code | 설명 |
|---:|---|
| 200 | 주문 요약 조회 성공 |
| 404 | `orderId`가 유효하지 않음 |
