# API 명세서

## 주문

### 주문 생성

- Description: 장바구니에서 선택된 아이템을 주문한다.
- Method: POST
- URI: /order/
- Request Body

```
{
    items: [
        {
            productId: number
            quantity: number
        }, ...
        ]
}
```

- Response

```
{
orderId: number,
}
```

- Status Code

201: 성공시 받아온 orderId로 새 리스트 생성.
400: quantity가 1이상 99이하여야 함. (음수, 0, 100이상)
400: 재고수량보다 많은 수량을 주문
404: 존재하지 않는 product를 주문
404: 카트에 존재하지 않는 product를 주문

### 주문 조회 (/order-confirm/:id 페이지)

- Description: 결제를 위한 주문을 조회한다.
- Method: GET
- URI: /order/:id
- Response

```
{
    items: [{ productId, name, price, quantity, imageUrl }],
    coupons: [
      {
        couponId,
        couponCode,   // name → couponCode
        expiredDate,
        minOrderAmount,
        usableStartAt,
        usableEndAt,
        isSelected,
        isDisabled,
      }
    ],
    remoteArea,
    orderAmount,
    couponDiscount,
    shippingFee,
    totalAmount,
  }
```

- Status Code

200: 성공

### 주문 취소

- Description: 주문 페이지에서 이탈시 임시 오더 db에서 오더가 삭제된다.
- Method: DELETE
- URI: /order/:id
- Status Code

204: 성공시 반환값 없음

### 제주도서산간여부 수정 (배송정보 토글)

- Description: 제주도서산간 체크박스에서 호출되는 api
- Method: PATCH
- URI: /order/:id/address
- Request Body

```
{
remoteArea: true/false
}
```

- Status Code

204: 성공시 반환값 없음

### 쿠폰 적용하기

- Description: 유저가 선택한 쿠폰을 주문에 적용한다.
- Method: PATCH
- URI: /order/:id/coupon
- Request Body

```
{
coupons: [1] // [1,2] | null, 최대 길이 2인 number[]
}
```

- Status Code

204: 성공시 반환값 없음
404: 존재하지 않는 coupon을 사용한 경우
400: coupon 조건 불만족 (유효기간, 사용가능시간, 최소주문금액, BTGO 쿠폰 개수)

### 쿠폰 할인액 계산하기

- Description: 체크된 쿠폰 조합으로 할인되는 금액을 계산한다.
- Method: GET
- URI: /order/:id/coupon/calculate?couponIds=1,2
- Response

```
{
couponDiscount: number
}
```

- Status Code

200: 성공
404: 존재하지 않는 coupon을 사용한 경우
400: coupon 조건 불만족 (유효기간, 사용가능시간, 최소주문금액, BTGO 쿠폰 개수)

## 결제

### 결제 확정

- Description: 주문을 최종 결제 처리한다.
- Method: POST
- URI: /order/:id/payment
- Response

```
{
    itemCount,
    totalQuantity,
    totalAmount,
}
```

- Status Code

200: 성공
404: 존재하지 않는 coupon을 사용한 경우
404: 존재하지 않는 product를 구매하려는 경우
400: coupon 조건 불만족 (유효기간, 사용가능시간, 최소주문금액, BTGO 쿠폰 개수)
400: 재고 < 요청 수량
