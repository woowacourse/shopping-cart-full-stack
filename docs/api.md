# API 스펙 문서

## 공통 응답 형식

성공 응답은 다음 구조를 따릅니다.

```json
{
  "status": "success",
  "message": "요청을 정상적으로 처리하였습니다.",
  "data": {}
}
```

에러 응답은 다음 구조를 따릅니다.

```json
{
  "status": "error",
  "message": "요청을 처리하는 중 오류가 발생하였습니다."
}
```

에러의 경우 status code는 `4xx`입니다.

---

## 상품 (Products)

### 상품 목록 조회

| 항목        | 값          |
| ----------- | ----------- |
| URI         | `products/` |
| Method      | `GET`       |
| Status Code | `200`       |

**Response Body**

```json
{
  "status": "success",
  "message": "상품 목록을 정상적으로 조회하였습니다.",
  "data": {
    "id": "number",
    "image": "string",
    "name": "string",
    "price": "number"
  }
}
```

### 상품 추가

| 항목        | 값          |
| ----------- | ----------- |
| URI         | `products/` |
| Method      | `POST`      |
| Status Code | `201`       |

**Request Body**

```json
{
  "image": "string",
  "name": "string",
  "price": "number"
}
```

**Response Body**

```json
{
  "status": "success",
  "message": "상품을 정상적으로 등록하였습니다.",
  "data": {
    "id": "number",
    "image": "string",
    "name": "string",
    "price": "number"
  }
}
```

### 상품 삭제

| 항목        | 값             |
| ----------- | -------------- |
| URI         | `products/:id` |
| Method      | `DELETE`       |
| Status Code | `200`          |

**Response Body**

```json
{
  "status": "success",
  "message": "상품을 정상적으로 삭제하였습니다.",
  "data": {
    "id": "number"
  }
}
```

---

## 장바구니 (Carts)

### 장바구니에 담긴 상품 목록 조회

| 항목        | 값       |
| ----------- | -------- |
| URI         | `carts/` |
| Method      | `GET`    |
| Status Code | `200`    |

**Response Body**

```json
{
  "carts": [
    {
      "product": {
        "id": "number",
        "image": "string",
        "name": "string",
        "price": "number"
      },
      "quantity": "number"
    }
  ],
  "totalPrice": 100000,
  "totalQuantity": 2
}
```

### 장바구니 상품 수량 변경

| 항목        | 값          |
| ----------- | ----------- |
| URI         | `carts/:id` |
| Method      | `PATCH`     |
| Status Code | `200`       |

**Request Body**

```json
{
  "quantity": "number"
}
```

**Response Body**

```json
{
  "status": "success",
  "message": "장바구니 상품 수량을 정상적으로 변경하였습니다.",
  "data": {
    "product": {
      "id": "number",
      "image": "string",
      "name": "string",
      "price": "number"
    },
    "quantity": "number"
  }
}
```

### 장바구니에 담긴 상품 제거

| 항목        | 값          |
| ----------- | ----------- |
| URI         | `carts/:id` |
| Method      | `DELETE`    |
| Status Code | `200`       |

**Response Body**

```json
{
  "status": "success",
  "message": "장바구니에서 상품을 정상적으로 제거하였습니다.",
  "data": {
    "id": "number"
  }
}
```
