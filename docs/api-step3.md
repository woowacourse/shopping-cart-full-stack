## API POST /api/checkout - 클라이언트에서 받은 정보를 기반으로 주문서 정보를를 생성해서 반환한다.

`FIXED5000` 와 `MIRACLESALE`를 사용햇을 떄, `FIXED5000`만 적용된 응답

### Body

```json
{
  "checked_product_list": ["123", "456"],
  "hard_delivery_place": true,
  "selected_coupons": ["FIXED5000", "MIRACLESALE"]
}
```

### Success Response

```json
{
  price_summary: {
    order_price: 70000
    dicount_price: 6000
    delivery_price: 3000
    total_price: 67000
  }
  hard_delivery_price: 3000,
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
  coupons_info:[
  {
    id: "FIXED5000",
    name: "5,000원 할인 쿠폰",
    expiriation_date: 2026-11-30,
    description: "최소 주문 금액: 100,000원",
    status:{
      type: "USABLE",
      message: null,
      apply: true,
    },
    discount: { type: "FIXED", amount: 5000 },
  },
  {
    id: "BOGO",
    name: "2+1 쿠폰",
    expiriation_date: 2026-06-30,
    description: "",
    status:{
      type: "USABLE",
      message: null,
      apply: false,
    },
    discount: { type: "FIXED", amount: 0 },
  },
  {
    id: "FREESHIPPING",
    name: "무료 배송 쿠폰",
    expiriation_date: 2026-08-31,
    description: "최소 주문 금액: 50,000원",
    status:{
      type: "USABLE",
      message: null,
      apply: false,
    },
    discount: { type: "FIXED", amount: 3000 },
  },
  {
    id: "MIRACLESALE",
    name: "30% 시간제 할인 쿠폰",
    expiriation_date: 2026-07-31,
    description: "사용 가능 시간: 오전 4시부터 7시까지"
    status:{
      type: "UNUSABLE",
      message: "현재 사용 가능 시간이 아닙니다",
      apply: false,
    },
    discount: { type: "RATE", rate: 30 },
  },
  ],
  best_coupons: ["FIXED5000","FREESHIPPING"],
  gifts: [{ product_id: "456", quantity: 1 }],
}
```

STATUS: 200

클라이언트는 `apply` 필드와 비교하여 적용됐는지 확인 할 수 있다

## `POST` `/api/payment/` - 영수증을 생성한다.

### Body

```json
{
  "checked_product_list": ["123", "456"],
  "hard_delivery_place": true,
  "selected_coupons": ["FIXED5000", "MIRACLESALE"]
}
```

### Success Response

```json
{
  "receipt_id": "123-456"
}
```

STATUS: 201
