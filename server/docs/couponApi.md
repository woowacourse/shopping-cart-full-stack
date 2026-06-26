# 쿠폰 API 명세서

> 변경 사항: 초기 설계에서는 `GET` + request body 로 4개의 엔드포인트를 두었으나,
> 브라우저 `fetch` 는 `GET` 요청에 body 를 실을 수 없어 동작하지 않는다.
> 그래서 **body 가 필요한 엔드포인트는 `POST`** 로 바꾸고,
> 금액 계산의 단일 원천(SSOT)을 한 곳에 모으기 위해 엔드포인트를 3개로 통합했다.

## 설계 원칙: SSOT

- 쿠폰 할인, 배송비, 최종 결제 금액 등 **돈과 관련된 모든 계산은 서버가 담당**한다.
- 클라이언트는 서버가 내려준 값을 **표시만** 한다. (요구사항: "클라이언트가 임의로 계산하지 않도록")
- 장바구니 화면의 소계는 미리보기일 뿐이며, 쿠폰/결제 단계의 금액은 항상 서버 계산을 따른다.

---

## 1. 쿠폰 목록 조회

- **Method**: `GET`
- **Path**: `/coupons`
- **Request Body**: 없음

**Response `200`**

```json
{
  "coupons": [
    { "id": 1, "name": "5,000원 할인 쿠폰", "type": "FIXED5000", "expiryDate": "2026-11-30", "minAmount": 100000, "startTime": null, "endTime": null },
    { "id": 2, "name": "2+1 쿠폰", "type": "BOGO", "expiryDate": "2026-06-30", "minAmount": null, "startTime": null, "endTime": null },
    { "id": 3, "name": "무료 배송 쿠폰", "type": "FREESHIPPING", "expiryDate": "2026-08-31", "minAmount": 50000, "startTime": null, "endTime": null },
    { "id": 4, "name": "30% 시간제 할인 쿠폰", "type": "MIRACLESALE", "expiryDate": "2026-07-31", "minAmount": null, "startTime": "04:00", "endTime": "07:00" }
  ]
}
```

**근거**: 쿠폰 메타데이터는 장바구니 상태와 무관한 정적 데이터이므로 body 없는 `GET` 으로 둔다.
쿠폰마다 필드가 다르므로 사용하지 않는 필드는 `null` 로 채워 응답 형태를 통일한다.
"지금 쓸 수 있는가(isAvailable)"는 장바구니/지역에 따라 달라지므로 아래 계산 API 에서 함께 내려준다.

---

## 2. 결제 금액 계산 (SSOT)

- **Method**: `POST`
- **Path**: `/coupons/calculation`

**Request Body**

```json
{
  "items": [{ "price": 60000, "quantity": 2 }],
  "couponIds": [1],
  "isRemoteArea": false
}
```

**Response `200`**

```json
{
  "orderAmount": 120000,
  "discountAmount": 5000,
  "shippingFee": 0,
  "totalPayment": 115000,
  "totalDiscount": 5000,
  "availableCouponIds": [1, 2, 4],
  "recommendedCouponIds": [2, 4]
}
```

**Response `400`** — 존재하지 않는 쿠폰(`INVALID_COUPON_TYPE`) / 2개 초과 선택(`TOO_MANY_COUPONS`)

**근거**: 화면에 필요한 모든 금액 계산을 한 번의 요청으로 처리한다.

- `orderAmount` / `discountAmount` / `shippingFee` / `totalPayment`: 결제 금액 요약에 그대로 표시
- `totalDiscount`: 상품 할인 + 배송비 절약을 합친 값. 모달의 "총 N원 할인 쿠폰 사용하기" 버튼에 표시
- `availableCouponIds`: 현재 장바구니/지역 기준으로 선택 가능한 쿠폰 (모달에서 비활성화 처리)
- `recommendedCouponIds`: 할인 효과가 가장 큰 조합 (모달의 "최대 할인 적용")

계산 규칙: **정액 쿠폰(FIXED5000, BOGO)을 먼저** 적용해 상품 금액을 깎고,
그 다음 **정율 쿠폰(MIRACLESALE)** 을 할인된 금액에 적용한다. 무료 배송 쿠폰은 배송비를 깎는다.
사용 불가능한(만료/최소금액 미달/시간대 밖) 쿠폰은 계산에서 자동으로 무시된다.

---

## 3. 쿠폰 검증 (결제 시점)

- **Method**: `POST`
- **Path**: `/coupons/validation`

**Request Body**

```json
{ "couponIds": [1, 2] }
```

**Response `200`**

```json
{ "message": "올바른 쿠폰입니다." }
```

**Response `400` / `404`**

| code              | status | message                              |
| ----------------- | ------ | ------------------------------------ |
| NOT_FOUND_COUPON  | 404    | 해당 쿠폰이 존재하지 않습니다.       |
| EXPIRED_COUPON    | 400    | 만료된 쿠폰이 존재합니다.            |
| TOO_MANY_COUPONS  | 400    | 사용 가능한 쿠폰 수량을 초과했습니다. |

**근거**: "결제하기"를 누른 시점을 기준으로 쿠폰의 존재/만료/개수를 다시 검증한다.
계산 시점과 결제 시점 사이에 쿠폰이 만료될 수 있으므로, 결제 직전에 한 번 더 확인한다.
DB 조작(등록/수정/삭제) API 는 요구사항에 따라 구현하지 않으며, 쿠폰은 서버에 하드코딩되어 있다.
