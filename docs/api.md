# step4 API 명세서

## 공통 규칙

- 요청/응답 body는 JSON 형식으로 전달한다.
- JSON 필드 이름은 영문 camelCase를 사용하고, 의미는 각 표에서 한글로 설명한다.
- `userId`는 body로 보내지 않고 인증 정보(헤더/세션)로 서버가 식별한다.
- 에러 응답은 아래 공통 형식으로 반환한다.

```json
{
  "code": "에러 코드",
  "message": "에러 메시지"
}
```

## 1. 주문 요약 계산

> 주문 확인 페이지 첫 진입 시 호출되며, 사용자의 행동에 따라 금액이 확정되어야 할 때(쿠폰 적용 및 산간지역 토글 시), 재호출됩니다.

> 변경의 이유는 다르더라도 결국 한 묶음의 주문 옵션으로 생각했기 때문에, 묶어서 하나의 API로 구현하였습니다.

```http
POST /orders/summary
```

### Request

```json
{
  "selectedCartItemIds": [10, 12],
  "selectedCouponIds": [1, 3],
  "isRemoteArea": false
}
```

| 이름                  | 필수 여부 | 설명                                               |
| --------------------- | --------- | -------------------------------------------------- |
| `selectedCartItemIds` | 필수      | 선택된 장바구니 상품 id 배열                       |
| `selectedCouponIds`   | 필수      | 적용할 쿠폰 id 배열 (최대 2개, 없으면 쿠폰 미적용) |
| `isRemoteArea`        | 필수      | 제주도·도서 산간 지역 체크 여부 (기본값 `false`)   |

### Response

`200 OK`

```json
{
  "orderItems": [
    {
      "id": 10,
      "productId": 1,
      "quantity": 2,
      "name": "나이키",
      "stock": 10,
      "imageUrl": "https://picsum.photos/seed/laptop/160/160",
      "price": 300000
    }
  ],
  "orderAmount": 10000,
  "couponDiscountAmount": 5000,
  "shippingFee": 3000,
  "totalPaymentAmount": 8000
}
```

| 이름                   | 설명                      |
| ---------------------- | ------------------------- |
| `orderItems`           | 선택된 장바구니 상품 목록 |
| `orderAmount`          | 주문 금액                 |
| `couponDiscountAmount` | 쿠폰 할인 금액            |
| `shippingFee`          | 배송비                    |
| `totalPaymentAmount`   | 총 결제 금액              |

### Error

`400 Bad Request` 또는 `404 Not Found`

```json
{
  "code": "CART_ITEM_NOT_FOUND",
  "message": "존재하지 않는 장바구니 상품입니다."
}
```

| 상태 코드         | 에러 코드               | 설명                                                        |
| ----------------- | ----------------------- | ----------------------------------------------------------- |
| `400 Bad Request` | `INVALID_REQUEST_BODY`  | 요청값이 없거나 형식에 맞지 않는 경우                       |
| `404 Not Found`   | `CART_ITEM_NOT_FOUND`   | 해당 `cartItemId`의 장바구니 상품이 존재하지 않는 경우      |
| `404 Not Found`   | `COUPON_NOT_FOUND`      | 해당 `couponId`의 쿠폰이 존재하지 않는 경우                 |
| `400 Bad Request` | `EXCEEDS_COUPON_LIMIT`  | 적용하려는 쿠폰이 최대 적용 개수(2장)를 초과한 경우         |
| `400 Bad Request` | `COUPON_NOT_APPLICABLE` | 만료·사용 완료·적용 조건 미달 등 적용할 수 없는 쿠폰인 경우 |

## 2. 쿠폰 목록 조회

```http
POST /coupon
```

### Request

```json
{
  "selectedCartItemIds": [10, 12],
  "isRemoteArea": false
}
```

| 이름                  | 필수 여부 | 설명                                             |
| --------------------- | --------- | ------------------------------------------------ |
| `selectedCartItemIds` | 필수      | 선택된 장바구니 상품 id 배열                     |
| `isRemoteArea`        | 필수      | 제주도·도서 산간 지역 체크 여부 (기본값 `false`) |

### Response

`200 OK`

사용 가능한 쿠폰이 없으면 `bestCombination`은 빈 배열을 응답한다.

```json
{
  "bestCombination": [1, 3],
  "totalPrice": 100000,
  "couponResponses": [
    {
      "id": 1,
      "name": "5,000원 할인 쿠폰",
      "description": ["만료일: 2027년 11월 30일", "최소 주문 금액: 100,000원"],
      "discountType": "FIXED",
      "isUsable": true,
      "discountValue": 5000
    },
    {
      "id": 3,
      "name": "5만원 이상 구매 시 무료 배송 쿠폰",
      "description": ["만료일: 2027년 11월 30일"],
      "discountType": "SHIPPING",
      "isUsable": true,
      "discountValue": 3000
    }
  ]
}
```

| 이름              | 설명                                                         |
| ----------------- | ------------------------------------------------------------ |
| `bestCombination` | 최대 할인을 받을 수 있는 쿠폰 id 배열                        |
| `totalPrice`      | 선택된 상품 기준 전체 주문 금액                              |
| `id`              | 쿠폰 식별 id                                                 |
| `name`            | 쿠폰 이름                                                    |
| `description`     | 쿠폰 상세 정보 배열                                          |
| `discountType`    | 할인 타입 (`FIXED` / `RATE` / `SHIPPING`)                    |
| `isUsable`        | 현재 주문에서 쿠폰을 사용할 수 있는지 여부                   |
| `discountValue`   | 정액 할인 금액, 할인율 또는 배송비 할인액 (사용 불가 시 `0`) |

### Error

| 상태 코드         | 에러 코드              | 설명                                                   |
| ----------------- | ---------------------- | ------------------------------------------------------ |
| `400 Bad Request` | `INVALID_REQUEST_BODY` | 요청값이 없거나 형식에 맞지 않는 경우                  |
| `404 Not Found`   | `CART_ITEM_NOT_FOUND`  | 해당 `cartItemId`의 장바구니 상품이 존재하지 않는 경우 |
