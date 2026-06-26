# 장바구니 API 명세

- [API 명세 스프레드시트](https://docs.google.com/spreadsheets/d/15ukpAbl2II9rq9B_h0LgOBC9pzwLL3i4L3weXQM_dT4/edit?gid=0#gid=0)

## 배송 정책

| Method | Endpoint                | Description      | Path Params | Query Params | Request Body | Status | Response Body                                            | Response Description              | Notes |
| ------ | ----------------------- | ---------------- | ----------- | ------------ | ------------ | ------ | -------------------------------------------------------- | --------------------------------- | ----- |
| GET    | `/api/shipping-policy/` | 배송비 정책 조회 | -           | -            | -            | 200    | `{ "baseFee": number, "freeShippingThreshold": number }` | 기본 배송비와 무료 배송 기준 금액 |       |

## 쿠폰

| Method | Endpoint        | Description         | Path Params | Query Params | Request Body | Status | Response Body                                       | Response Description | Notes |
| ------ | --------------- | ------------------- | ----------- | ------------ | ------------ | ------ | --------------------------------------------------- | -------------------- | ----- |
| GET    | `/api/coupons/` | 전체 쿠폰 정보 조회 | -           | -            | -            | 200    | `{ "maxCouponCount": number, "coupons": Coupon[] }` |                      |       |

#### Coupon

```ts
type Coupon = {
  id: string;
  code: 'FIXED5000' | 'BOGO' | 'FREESHIPPING' | 'MIRACLESALE';
  name: string;
  expiresAt: string;
  conditions?: {
    minimumOrderAmount?: number;
    availableTimeRange?: {
      startsAt: string;
      endsAt: string;
    };
  };
};
```

## 주문서

| Method | Endpoint                                  | Description                    | Path Params | Query Params | Request Body                           | Status | Response Body                                                                                              | Response Description                              | Notes                                                  |
| ------ | ----------------------------------------- | ------------------------------ | ----------- | ------------ | -------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| POST   | `/api/order-sheets/`                      | 주문서 생성                    | -           | -            | `{ "items": OrderSheetRequestItem[] }` | 201    | `{ "id": string }`                                                                                         | 생성된 주문서 ID                                  | 생성 시 사용 가능한 쿠폰 중 최대 할인 조합을 자동 선택 |
| GET    | `/api/order-sheets/:id/`                  | 주문서 조회                    | `id`        | -            | -                                      | 200    | `{ "orderSheet": OrderSheet }`                                                                             | 주문서 상세 정보                                  | 응답에서 `userId`는 제외                               |
| PATCH  | `/api/order-sheets/:id/shipping-area/`    | 도서산간 지역 여부 수정        | `id`        | -            | `{ "isRemoteShippingArea": boolean }`  | 204    | -                                                                                                          | 수정 성공                                         |                                                        |
| GET    | `/api/order-sheets/:id/coupons/`          | 주문서에 적용 가능한 쿠폰 조회 | `id`        | -            | -                                      | 200    | `{ "coupons": [{ "id": string, "code": string }] }`                                                        | 현재 주문서에서 사용 가능한 쿠폰 ID와 코드        |                                                        |
| PATCH  | `/api/order-sheets/:id/coupons/`          | 선택 쿠폰 저장                 | `id`        | -            | `{ "selectedCouponIds": string[] }`    | 204    | -                                                                                                          | 수정 성공                                         |                                                        |
| POST   | `/api/order-sheets/:id/discount-preview/` | 선택 쿠폰 할인 금액 미리보기   | `id`        | -            | `{ "selectedCouponIds": string[] }`    | 200    | `{ "discountAmount": number }`                                                                             | 선택한 쿠폰 조합의 할인 금액                      | 계산만 수행하며 DB에는 저장하지 않음                   |
| GET    | `/api/order-sheets/:id/pricing/`          | 주문서 결제 금액 요약 조회     | `id`        | -            | -                                      | 200    | `{ "pricing": { "orderAmount": number, "shippingFee": number, "discountAmount": number, "totalPaymentAmount": number } }` | 상품 금액, 배송비, 쿠폰 할인 금액, 최종 결제 금액 |                                                        |

#### OrderSheet

```ts
type OrderSheet = {
  id: string;
  items: {
    product: Product;
    quantity: number;
  }[];
  selectedCouponIds: string[];
  isRemoteShippingArea: boolean;
};
```

## 공통 에러 응답

| Status | Response Body                                                                        | 발생 조건                                                       |
| ------ | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 404    | `{ "code": "RESOURCE_NOT_FOUND", "message": "요청한 리소스를 찾을 수 없습니다." }`   | 존재하지 않는 상품, 장바구니 아이템, 주문서, 쿠폰을 요청한 경우 |
| 500    | `{ "code": "INTERNAL_SERVER_ERROR", "message": "예기치 못한 오류가 발생했습니다." }` | 예상하지 못한 서버 오류가 발생한 경우                           |
