# API 명세서

## 데이터 구조

### 1. 상품 (Product)
```json
{
  "id": "string",
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```
- 결정 이유: 피그마 디자인에서 필요한 상품 속성을 확인하여, 상품 목록과 상세 화면에 필요한 `id`, `name`, `price`, `imageUrl`를 포함했습니다.

### 2. 장바구니 항목 (Cart Item)
```json
{
  "id": "string",
  "productId": "string",
  "name": "string",
  "price": number,
  "imageUrl": "string",
  "count": number
}
```
- 결정 이유: 서버가 단순히 `productId`와 `count`만 저장하더라도, 클라이언트가 화면에 렌더링하기 쉬운 형태로 `name`, `price`, `imageUrl`를 함께 제공하는 것이 구현과 유지보수에 좋다고 판단했습니다.

## 상품 API
- 서버 구현은 응답 본문에 `status`나 `message`를 공통으로 포함하지 않고,
  HTTP 상태 코드로 결과를 표현합니다.

### 1. 전체 상품 목록 조회
- Method: `GET`
- URL: `/products`

#### Response
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
- HTTP 상태 코드: `200`
- 결정 이유: 상품 목록 화면에서 필요한 모든 상품 정보를 한 번에 받아오도록 설계했습니다.

### 2. 상품 추가
- Method: `POST`
- URL: `/products`

#### Request
```json
{
  "name": "string",
  "price": number,
  "imageUrl": "string"
}
```

#### Response (성공)
```json
{
  "body": [
    {
      "id": "string"
    }
  ]
}
```
- HTTP 상태 코드: `201`
- 결정 이유: 상품 생성 시 클라이언트는 상품 속성만 보내고, 서버는 새로 생성된 `id`만 응답하여 추가 상태를 관리하기 쉽게 했습니다.

#### Response (중복)
- HTTP 상태 코드: `409`
- body: 없음
- 결정 이유: 이미 존재하는 상품을 다시 등록하려는 경우, 서버 상태와 충돌(conflict)이므로 `409`를 사용합니다.

#### Response (서버 오류)
- HTTP 상태 코드: `500`
- body: 없음

### 3. 상품 삭제
- Method: `DELETE`
- URL: `/products/:id`

#### Response (성공)
- HTTP 상태 코드: `204`
- body: 없음

#### Response (존재하지 않음)
- HTTP 상태 코드: `404`
- body: 없음

#### Response (서버 오류)
- HTTP 상태 코드: `500`
- body: 없음

- 결정 이유: 상품이 삭제되면 본문 없이 `204`로 응답하고, 없는 상품 요청에는 `404`를 사용해 명확하게 처리합니다.

## 장바구니 API

### 1. 장바구니 전체 조회
- Method: `GET`
- URL: `/carts`

#### Response
```json
{
  "status": number,
  "message": "string",
  "body": [
    {
      "id": "string",
      "productId": "string",
      "name": "string",
      "price": number,
      "imageUrl": "string",
      "count": number
    }
  ]
}
```
- 결정 이유: 장바구니 화면에서 상품 정보와 수량을 동시에 보여줄 수 있도록 응답 구조를 설계했습니다.

### 2. 장바구니 수량 변경
- Method: `PATCH`
- URL: `/carts/:id`

#### Request
```json
{
  "count": number
}
```

#### Response
```json
{
  "status": number,
  "message": "string",
  "body": {
    "id": "string",
    "count": number
  }
}
```
- 결정 이유: 장바구니 항목 하나의 수량만 변경할 때, 변경된 항목의 `id`와 `count`만 반환하여 최소한의 데이터로 상태를 갱신할 수 있게 했습니다.

### 3. 장바구니 항목 삭제
- Method: `DELETE`
- URL: `/carts/:id`

#### Response
```json
{
  "status": number,
  "message": "string"
}
```
- 결정 이유: 장바구니 항목을 제거할 때 간단한 성공 응답만으로 충분하며, 클라이언트는 이후 전체 목록을 다시 조회하거나 로컬 상태를 업데이트할 수 있습니다.
