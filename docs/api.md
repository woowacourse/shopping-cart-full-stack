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
  "data": [
    {
      "id": "number",
      "image": "string",
      "name": "string",
      "price": "number"
    }
  ]
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
  "status": "success",
  "message": "장바구니를 정상적으로 조회하였습니다.",
  "data": {
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
    ]
  }
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

---

## 설계 원칙

### 엔드포인트 URL 설계

REST 원칙 중에서 본 프로젝트에 꼭 필요한 규칙을 선별해 적용했습니다.

- **소문자만 사용**: `/products` (O) / `/Products` (X)
- **복수형 명사 사용**: 자원의 집합을 나타내기 위해 복수형을 사용합니다. `/products` (O) / `/product` (X)
- **계층 관계 표현**: 자원 간의 소속 관계를 URL 경로로 표현합니다.
  - `/products` → 전체 상품 목록
  - `/products/1` → 1번 상품
  - `/carts` → 장바구니에 담긴 상품 목록
  - `/carts/1` → 장바구니의 1번 항목

### 상태 코드

요청의 처리 결과를 명확히 전달하기 위해 다음 상태 코드를 사용합니다.
부가적으로, DELETE 응답에 대해 응답값을 전달하기 위해 200을 사용하였습니다.

**2xx — 성공**

- `200 OK` — 일반적인 성공 응답
- `201 Created` — 리소스 생성 성공 (POST)

**4xx — 클라이언트 오류**

- `400 Bad Request` — 잘못된 요청 (유효성 검사 실패 등)
- `404 Not Found` — 요청한 리소스를 찾을 수 없음

### POST / PATCH / DELETE 응답에 `data`를 포함하는 이유

요청 후의 후속 처리를 클라이언트가 서버에 추가 요청 없이 수행할 수 있도록 응답에 변경된 데이터를 함께 내려줍니다.

예시 :

- 응답 데이터를 바탕으로 클라이언트에서 즉시 UI를 갱신할 수 있습니다.
- 추가 액션이 필요한 경우(예: 방금 추가한 상품을 다시 제거)에도 별도 조회 요청 없이 응답 데이터를 활용할 수 있습니다.
- 클라이언트-서버 간 데이터 불일치를 줄여 일관된 상태를 유지할 수 있습니다.

### `status`, `message`, `data` 계층을 둔 이유

HTTP 상태 코드만으로는 표현하기 어려운 정보를 명시적으로 전달하기 위해 응답 본문에 별도 계층을 두었습니다.

- **명시적인 성공/실패 표현**: 클라이언트가 `status` 필드를 통해 도메인 차원의 처리 결과를 안정적으로 판단할 수 있습니다.
- **디버깅 편의성**: `message`에 처리 결과를 담아 프론트-백엔드 간 통신 문제를 빠르게 추적할 수 있습니다.
- **확장성**: 요청은 성공했지만 비즈니스 로직상 실패한 경우(2xx + `error`)나 빈 데이터를 200으로 응답하는 경우 등, 단순 상태 코드만으로 부족한 상황을 표현할 여지를 남깁니다. (단, 2xx + `error` 패턴의 적용 여부는 추후 논의)
