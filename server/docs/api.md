# API 명세서

## 📌 공통 상태 코드 (Status Code)

| Code  | 설명                                                         |
| ----- | ------------------------------------------------------------ |
| `200` | 요청이 성공적으로 이루어진 경우 (GET / PATCH)                |
| `201` | POST 요청이 성공적으로 이루어져 새로운 데이터가 생성된 경우  |
| `204` | DELETE 요청이 성공적으로 이루어진 경우 (반환값 없음)         |
| `400` | 클라이언트의 요청이 유효하지 않은 대부분의 경우              |
| `404` | 요청한 리소스가 존재하지 않는 경우                           |
| `500` | 서버 자체 에러                                               |

---

## 상품 (Products)

### 1. 상품 조회

- **Method**: `GET`
- **Path**: `/products`

**Request Body**

필요 없음

**Response `200`**

```json
{
  "code": 200,
  "message": "요청에 성공했습니다.",
  "result": {
    "products": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "quantity": 10
      },
      {
        "id": 2,
        "name": "아디다스 신발",
        "price": 50000,
        "imgUrl": "https://sdasd.asdas.com",
        "quantity": 20
      }
    ]
  }
}
```

---

### 2. 상품 추가

- **Method**: `POST`
- **Path**: `/products`

**Request Body**

```json
{
  "name": "아디다스 양말",
  "price": 13000,
  "imgUrl": "https://image-url.com",
  "quantity": 2
}
```

**Response `201`**

```json
{
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "id": 1
  }
}
```

**Response `400`**

```json
{
  "code": "PRODUCT_NAME_LENGTH_EXCEEDED",
  "message": "상품명은 100자를 초과할 수 없습니다."
}
```

```json
{
  "code": "INVALID_PRODUCT_PRICE_TYPE",
  "message": "가격은 0보다 큰 숫자여야 합니다."
}
```

```json
{
  "code": "INVALID_PRODUCT_QUANTITY_RANGE",
  "message": "상품 재고는 1이상 99이하의 정수이어야 합니다."
}
```

```json
{ "code": "EMPTY_PRODUCT_NAME", "message": "상품명 필드가 누락되었습니다." }
```

```json
{ "code": "EMPTY_PRODUCT_PRICE", "message": "가격 필드가 누락되었습니다." }
```

```json
{
  "code": "EMPTY_PRODUCT_QUANTITY",
  "message": "상품 재고 필드가 누락되었습니다."
}
```

---

### 3. 상품 삭제

- **Method**: `DELETE`
- **Path**: `/products/{id}`

**Request Body**

필요 없음

**Response `204`**

```
204 No Content
```

**Response `404`**

```json
{
  "code": "PRODUCT_NOT_EXIST",
  "message": "상품이 존재하지 않습니다."
}
```

---

## 장바구니 (Carts)

### 1. 장바구니 상품 조회

- **Method**: `GET`
- **Path**: `/carts`

**Request Body**

필요 없음

**Response `200`**

```json
{
  "code": 200,
  "message": "요청에 성공했습니다.",
  "result": {
    "cartItems": [
      {
        "id": 1,
        "name": "나이키 양말",
        "price": 5000,
        "imgUrl": "https://sdasd.asdas.com",
        "itemCount": 3
      },
      {
        "id": 2,
        "name": "아디다스 신발",
        "price": 50000,
        "imgUrl": "https://sdasd.asdas.com",
        "itemCount": 1
      }
    ]
  }
}
```

---

### 2. 장바구니 상품 추가

- **Method**: `POST`
- **Path**: `/carts`

**Request Body**

```json
{
  "productId": 1,
  "itemCount": 2
}
```

**Response `201`**

```json
{
  "message": "성공적으로 생성되었습니다.",
  "result": {
    "productId": 1
  }
}
```

**Response `400`**

```json
{
  "code": "INVALID_PRODUCT_ORDER_COUNT_TYPE",
  "message": "변경할 수량은 0보다 큰 숫자여야 합니다."
}
```

```json
{
  "code": "EMPTY_PRODUCT_ORDER_COUNT",
  "message": "주문 수량 필드가 누락되었습니다."
}
```

---

### 3. 장바구니 상품 수량 변경

- **Method**: `PATCH`
- **Path**: `/carts/{id}`

**Request Body**

```json
{
  "itemCount": 3
}
```

**Response `200`**

```json
{
  "code": 200,
  "message": "성공적으로 수량이 변경되었습니다.",
  "result": {
    "id": 1,
    "itemCount": 3
  }
}
```

**Response `400`**

```json
{
  "code": "INVALID_PRODUCT_ORDER_COUNT_TYPE",
  "message": "변경할 수량은 0보다 큰 숫자여야 합니다."
}
```

```json
{
  "code": "PRODUCT_ORDER_COUNT_EXCEEDED",
  "message": "보유한 상품의 개수를 넘어섰습니다."
}
```

```json
{
  "code": "EMPTY_PRODUCT_ORDER_COUNT",
  "message": "주문 수량 필드가 누락되었습니다."
}
```

**Response `404`**

```json
{
  "code": "PRODUCT_NOT_EXIST_IN_CART",
  "message": "해당 상품이 장바구니에 존재하지 않습니다."
}
```

---

### 4. 장바구니 상품 삭제

- **Method**: `DELETE`
- **Path**: `/carts/{id}`

**Request Body**

필요 없음

**Response `204`**

```
204 No Content
```

**Response `404`**

```json
{
  "code": "PRODUCT_NOT_EXIST_IN_CART",
  "message": "해당 상품이 장바구니에 존재하지 않습니다."
}
```
