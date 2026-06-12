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
   order_id: number,
}
```

- Status Code

204: 성공시 반환값 없음.

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
    order_id: number
    items: [
        {
            productId, name, price, quantity, imageUrl
        }, ...
    ],
    coupons: [
        {   coupon_id, name, expired_date, min_order_amount, usable_start_at, usable_end_at,
            isSelected, // 선택여부
            disabled, // 선택가능여부
        }, ...
    ]
    remote_area: true/false // 제주도서산간여부
    order_amount // 주문금액
    coupon_discount // 쿠폰할인금액
    shipping_fee // 배송비
    total_amount // 총결제금액
}
```

- Status Code

200: 성공

### 주문 취소

- Description: 주문 페이지에서 이탈시 임시 오더 db에서 오더가 삭제된다.
- Method: DELETE
- URI: /order/:id
- Response

{}

- Status Code

204: 성공시 반환값 없음

### 제주도서산간여부 수정(배송정보 토글)

- Description: 제주도서산간 체크박스에서 호출되는 api
- Method: PATCH
- URI: /order/:id/address
- Request Body

```
body: {
    remote_area: true/false
}
```

- Response

```
{}
```

- Status Code

204: 성공시 반환값 없음

### 쿠폰 적용하기

- Description: 유저가 선택한 쿠폰을 주문에 적용한다.
- Method: PATCH
- URI: /order/:id/coupon
- Request Body

```
body: {
    coupons: [1], // [1,2], null 최대 길이가 2인 number[]
}
```

- Response

```
{}
```

- Status Code

204: 성공시 반환값 없음

404: 존재하지 않는 coupon을 사용한 경우
400: coupon 조건을 만족하는지 (유효기간, 사용가능시간, 최소주문금액 만족인지, BTGO 쿠폰이면 개수도 만족하는지)

### 쿠폰 할인액 계산하기

- Description: 체크된 쿠폰 조합으로 할인되는 금액을 계산한다.
- Method: GET
- URI: /order/:id/coupon/calculate/:coupon_id1,:coupon_id2
- Response

```
{
   coupon_discount: 000 // 예상 할인액
}
```

- Status Code

200: 성공

404: 존재하지 않는 coupon을 사용한 경우
400: coupon 조건을 만족하는지 (유효기간, 사용가능시간, 최소주문금액 만족인지, BTGO 쿠폰이면 개수도 만족하는지)

결제

결제 정보 전송

- Description: 체크된 쿠폰 조합으로 할인되는 금액을 계산한다.
- Method: POST
- URI: /order/:id/payment
- Request Body

```
{
   order_id,
    remote_area,
    coupons,
}
```

- Response

```
response: {
    item_count,
    total_quantity,
    total_amount,
}
```

- Status Code

200: 성공

404: 존재하지 않는 coupon을 사용한 경우
404: 존재하지 않는 product를 구매하려는 경우
400: coupon 조건을 만족하는지 (유효기간, 사용가능시간, 최소주문금액 만족인지, BTGO 쿠폰이면 개수도 만족하는지)
400: 재고 < 요청 수량 인지
