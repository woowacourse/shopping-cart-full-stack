# API 명세서

## 공통
- 응답 본문이 있는 경우 최상위 필드는 `body`입니다.
- 응답 본문에는 `status`, `message`를 포함하지 않습니다.
- 요청 본문은 JSON 형식입니다.
- 에러 응답은 별도 본문 없이 상태 코드로만 표현합니다.

### 상태 코드

| 상태 코드 | 의미 |
| --- | --- |
| `200` | 요청 성공 |
| `201` | 리소스 생성 성공 |
| `204` | 요청 성공, 응답 본문 없음 |
| `400` | 요청 본문이 없거나 유효하지 않음 |
| `404` | 요청한 리소스가 없음 |
| `409` | 이미 존재하는 리소스와 충돌 |
| `500` | 서버 오류 |

## 상품

### `GET /products`

상품 목록을 조회합니다.

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

Responses
- `500`: 서버 오류

### `POST /products`

상품을 추가합니다.

Request
```json
{
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```

Request fields

| 필드 | 타입 | 필수 | 조건 |
| --- | --- | --- | --- |
| `name` | `string` | 예 | 1자 이상 100자 이하 |
| `price` | `number` | 예 | 0보다 큰 유한한 숫자 |
| `imageUrl` | `string` | 예 | 빈 문자열 불가 |

Request example
```json
{
  "name": "새 상품",
  "price": 1000,
  "imageUrl": "/new.png"
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
- `400`: 필수 필드 누락 또는 유효하지 않은 값
- `409`: 중복 상품
- `500`: 서버 오류

### `DELETE /products/:productId`

상품을 삭제합니다.

삭제한 상품이 장바구니에 담겨 있으면 해당 장바구니 항목도 함께 삭제합니다.

Path parameters

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `productId` | `string` | 삭제할 상품 id |

Responses
- `204`: 삭제 성공
- `404`: 상품 없음
- `500`: 서버 오류

## 장바구니

### `GET /carts`

장바구니 항목 목록을 조회합니다.

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

Responses
- `500`: 서버 오류

### `PATCH /carts/:cartItemId`

장바구니 항목의 수량을 변경합니다.

Path parameters

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `cartItemId` | `string` | 수량을 변경할 장바구니 항목 id |

Request
```json
{
  "quantity": number
}
```

Request fields

| 필드 | 타입 | 필수 | 조건 |
| --- | --- | --- | --- |
| `quantity` | `number` | 예 | 1 이상 99 이하의 정수 |

Request example
```json
{
  "quantity": 3
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
- `400`: 필수 필드 누락 또는 유효하지 않은 수량
- `404`: 장바구니 항목 없음
- `500`: 서버 오류

### `DELETE /carts/:cartItemId`

장바구니 항목을 삭제합니다.

Path parameters

| 이름 | 타입 | 설명 |
| --- | --- | --- |
| `cartItemId` | `string` | 삭제할 장바구니 항목 id |

Responses
- `204`: 삭제 성공
- `404`: 장바구니 항목 없음
- `500`: 서버 오류
