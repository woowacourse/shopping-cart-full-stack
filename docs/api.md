# API 명세서

## 공통
- 응답 본문이 있는 경우 최상위 필드는 `body`입니다.
- 응답 본문에는 `status`, `message`를 포함하지 않습니다.

## 상품

### `GET /products`

Response `200`
```json
{
  "body": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "imageUrl": "string"
    }
  ]
}
```

### `POST /products`

Request
```json
{
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```

Response `201`
```json
{
  "body": {
    "id": "string"
  }
}
```

Responses
- `409`: 중복 상품
- `500`: 서버 오류

### `DELETE /products/:id`

Responses
- `204`: 삭제 성공
- `404`: 상품 없음
- `500`: 서버 오류

## 장바구니

### `GET /carts`

Response `200`
```json
{
  "body": [
    {
      "id": "string",
      "productInfo": {
        "id": "string",
        "name": "string",
        "price": number,
        "imageUrl": "string"
      },
      "quantity": number
    }
  ]
}
```

### `PATCH /carts/:id`

Request
```json
{
  "quantity": number
}
```

Response `200`
```json
{
  "body": {
    "id": "string",
    "quantity": number
  }
}
```

Responses
- `404`: 장바구니 항목 없음
- `500`: 서버 오류

### `DELETE /carts/:id`

Responses
- `204`: 삭제 성공
- `404`: 장바구니 항목 없음
- `500`: 서버 오류
