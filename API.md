## 상품

| 기능           | Method | URL                | Request                                                                                                                  | Response                                                                                                                                                                                                                                                                                               |
| -------------- | ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 상품 목록 조회 | GET    | /api/products/     | X                                                                                                                        | <pre>[<br>{<br>&nbsp;&nbsp;"id": 1,<br>&nbsp;&nbsp;"name": "수건",<br>&nbsp;&nbsp;"thumbnail": "/some_image2",<br>&nbsp;&nbsp;"price": 10000<br>},<br>{<br>&nbsp;&nbsp;"id": 2,<br>&nbsp;&nbsp;"name": "양말",<br>&nbsp;&nbsp;"thumbnail": "/some_image",<br>&nbsp;&nbsp;"price": 3000<br>}<br>]</pre> |
| 상품 추가      | POST   | /api/products/     | <pre>{<br>&nbsp;&nbsp;"name": "치킨",<br>&nbsp;&nbsp;"thumbnail": "chicken.png",<br>&nbsp;&nbsp;"price": 5000<br>}</pre> | <pre>{<br>&nbsp;&nbsp;"id": 3<br>}</pre>                                                                                                                                                                                                                                                               |
| 상품 삭제      | DELETE | /api/products/:id/ | X                                                                                                                        | X                                                                                                                                                                                                                                                                                                      |

## 장바구니

| 기능                | Method | URL                  | Request                                         | Response                                                                                                                                                           |
| ------------------- | ------ | -------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 목록 조회           | GET    | /api/cart/           | X                                               | <pre>[<br>{<br>&nbsp;&nbsp;"product_id": 1,<br>&nbsp;&nbsp;"quantity": 20<br>},<br>{<br>&nbsp;&nbsp;"product_id": 5,<br>&nbsp;&nbsp;"quantity": 10<br>}<br>]</pre> |
| 특정 상품 수량 변경 | PATCH  | /api/cart/items/:id/ | <pre>{<br>&nbsp;&nbsp;"quantity": 15<br>}</pre> | <pre>{<br>&nbsp;&nbsp;"product_id": 1,<br>&nbsp;&nbsp;"quantity": 15<br>}</pre>                                                                                    |
| 특정 상품 삭제      | DELETE | /api/cart/items/:id/ | X                                               | X                                                                                                                                                                  |

---

### POST 응답

생성한 객체의 id를 반환합니다.
상황에 따라 id를 반환하는게 적절하다고 느꼈습니다.
POST이후 어디로 리다이렉트 되는지에 따라 반환값의 여부가 달라진다고 생각했습니다.
프론트엔드에서 POST 요청 이후 처리에 따라 응답 형식이 변경될거 같습니다.

### PATCH 응답

변경된 객체 전체를 반환합니다.
변경 후 다시 api를 요청하지 않고 해당 변경 사항을 바로 렌더링해야 한다고 생각했습니다.

### 200

PATCH 나 GET 처럼 요청이 성공하고 Response Body가 존재하는 경우 200을 반환합니다.

### 400

사용자가 잘못된 형식의 값을 전달했을때 400에러가 발생하도록 합니다.
필수필드를 전달하지 않았거나 유효하지 않은 값(e.g. 길이제한을 넘긴 필드)을 전달했을때 400코드를 응답합니다.

### 404

유효하지 않는 주소에 접근할때 404 에러가 발생하도록 합니다. 존재하지 않는 상품 id에 접근할 때 404코드를 전달합니다.

### 500

400, 404 예외가 아닌 예외들은 500 에러로 응답합니다.

</br>

# STEP3

</br>

## `POST` `/api/orders/` - 임시 주문서를 만든다.

### Body

```
[
  {
    product_id: "123",
    quantity: 2
  },
  {
    product_id: "456",
    quantity: 5
  }
]
```

### Success Response

```
{
  order_id: "123123"
}
```

STATUS: 201

## `GET` `/api/orders/{order-id}/` - 특정 임시 주문서를 가져온다.

### Success Response

```
{
  id: "123-456-789",
  hard_delivery_place: false,
  selected_coupons: [FIXED5000, BOGO],
  selected_items: [
    {
      id: "123"
      product: {
        name: "투썸 아이스크림"
        price: 4000
        thumbnail: "ice.png"
      }
      quantity: 2
    },
    {
      id: "456"
      product: {
        name: "투썸 초코 아이스크림"
        price: 4500
        thumbnail: "ice-choco.png"
      }
      quantity: 5
    }
  ],
  price_summary: {
    order_price: 70000
    dicount_price: 6000
    delivery_price: 3000
    total_price: 67000
  }
}
```

STATUS: 200

## `GET` `/api/orders/${order-id}/coupons/`- 주문서의 쿠폰 데이터를 가져온다.

### Success Response

```
{
  max_coupon_count: 2,
  items: [
  {
    id: "FIXED5000",
    name: "5,000원 할인 쿠폰",
    expiriation_date: 2026-11-30,
    description: "최소 주문 금액: 100,000원",
    is_active: false
  },
  {
    id: "BOGO",
    name: "2+1 쿠폰",
    expiriation_date: 2026-06-30,
    description: "",
    is_active: false
  },
  {
    id: "FREESHIPPING",
    name: "무료 배송 쿠폰",
    expiriation_date: 2026-08-31,
    description: "최소 주문 금액: 50,000원",
    is_active: true
  },
  {
    id: "MIRACLESALE",
    name: "30% 시간제 할인 쿠폰",
    expiriation_date: 2026-07-31,
    description: "사용 가능 시간: 오전 4시부터 7시까지",
    is_active: true
  },
]
}
```

STATUS: 200

## `POST` `/api/orders/{order-id}/discount-summary/ ` - 쿠폰 할인 예상 금액을 반환한다.

### Body

```
{
  selected_coupons: ["BOGO", "FREESHIPPING"]
}
```

### Success Response

```
{
  discount_price: 5000
}
```

STATUS: 200

## `PATCH` `/api/order/{order-id}/` - 임시 주문서를 수정한다.

### Body

```
{
  hard_delivery_place: true
}
```

```
{
  selected_coupons: ["FREESHIPPING"]
}
```

### Success Response

```
{
  id: "123-456-789",
  hard_delivery_place: true,
  selected_coupons: [FREESHIPPING],
  selected_items: [
    {
      id: "123"
      product: {
        name: "투썸 아이스크림"
        price: 4000
        thumbnail: "ice.png"
      }
      quantity: 2
    },
    {
      id: "456"
      product: {
        name: "투썸 초코 아이스크림"
        price: 4500
        thumbnail: "ice-choco.png"
      }
      quantity: 5
    }
  ],
  price_summary: {
    order_price: 70000
    dicount_price: 6000
    delivery_price: 3000
    total_price: 67000
  }
}
```

STATUS: 201
