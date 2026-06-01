# API 명세

| 구분               | Method | Path          | 성공 상태 |
| ------------------ | ------ | ------------- | --------- |
| 상품 목록 조회     | GET    | /products     | 200, 204  |
| 상품 추가          | POST   | /products     | 201       |
| 상품 제거          | DELETE | /products/:id | 204       |
| 장바구니 목록 조회 | GET    | /cart         | 200, 204  |
| 장바구니 수량 변경 | PATCH  | /cart/:id     | 204       |
| 장바구니 상품 제거 | DELETE | /cart/:id     | 204       |

## 공통

### 에러 응답 형식

```json
{
  "code": "ERROR_CODE",
  "message": "에러 메시지"
}
```

### 공통 에러 핸들러

#### 404 Not Found

잘못된 자원을 요청한 경우

**Response**

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "NOT_FOUND",
  "message": "요청한 자원을 찾을 수 없습니다."
}
```

#### 500 Internal Server Error

서버 프로세스는 살아 있는데 내부에서 예외가 난 경우

**Response**

```http
HTTP/1.1 500 Internal Server Error
Content-Type: application/json
```

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "서버 내부 오류가 발생했습니다."
}
```

---

## 상품

## 전체 상품 목록 조회

전체 상품목록을 조회할 수 있다.

```http
GET /products
```

### Response

#### 200 OK

데이터 조회 성공 후 조회 데이터 반환

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "name": "콜라",
    "stock": 10,
    "imageUrl": "https://example.com/images/cola.png",
    "price": 1500
  },
  {
    "id": 2,
    "name": "사이다",
    "stock": 5,
    "imageUrl": "https://example.com/images/cider.png",
    "price": 1400
  }
]
```

#### 204 No Content

데이터 조회에 성공했지만, 반환할 데이터 없음

```http
HTTP/1.1 204 No Content
```

```text
응답 body 없음
```

---

## 상품 추가

상품을 추가할 수 있다.

```http
POST /products
Content-Type: application/json
```

### Request

```json
{
  "name": "콜라",
  "stock": 10,
  "imageUrl": "https://example.com/images/cola.png",
  "price": 1500
}
```

### Request Body

| 필드     | 타입   | 필수 | 조건                |
| -------- | ------ | ---: | ------------------- |
| name     | string |    O | 최대 100자          |
| stock    | number |    O | 1 이상 99 이하 정수 |
| imageUrl | string |    O | 상품 이미지 URL     |
| price    | number |    O | 0보다 큰 숫자       |

### Response

#### 201 Created

상품 추가 성공

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```text
응답 body 없음
```

#### 400 Bad Request

요청 데이터 검증 오류

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

```json
{
  "code": "INVALID_PRODUCT_REQUEST",
  "message": "상품 요청 데이터가 올바르지 않습니다."
}
```

이름이 없는 경우

```json
{
  "code": "REQUIRED_PRODUCT_NAME",
  "message": "상품 이름은 필수입니다."
}
```

가격이 없는 경우

```json
{
  "code": "REQUIRED_PRODUCT_PRICE",
  "message": "상품 가격은 필수입니다."
}
```

재고가 없는 경우

```json
{
  "code": "REQUIRED_PRODUCT_STOCK",
  "message": "상품 재고는 필수입니다."
}
```

이미지가 없는 경우

```json
{
  "code": "REQUIRED_PRODUCT_IMAGE",
  "message": "상품 이미지는 필수입니다."
}
```

가격이 0 이하인 경우

```json
{
  "code": "INVALID_PRODUCT_PRICE",
  "message": "가격은 0보다 큰 숫자여야 합니다."
}
```

재고가 범위를 벗어난 경우

```json
{
  "code": "INVALID_PRODUCT_STOCK",
  "message": "재고는 1 이상 99 이하의 정수여야 합니다."
}
```

이름이 100자를 초과한 경우

```json
{
  "code": "INVALID_PRODUCT_NAME",
  "message": "상품 이름은 최대 100자까지 입력할 수 있습니다."
}
```

---

## 상품 삭제

id를 이용해 상품을 제거한다.  
상품 제거 후, 장바구니에 있는 해당 상품도 함께 제거된다.

```http
DELETE /products/:id
```

### Request

#### Query Parameter

| 이름 | 타입   | 필수 | 설명           |
| ---- | ------ | ---: | -------------- |
| id   | number |    O | 삭제할 상품 id |

### Response

#### 204 No Content

상품 및 장바구니에서 삭제 완료. 반환할 데이터 없음.

```http
HTTP/1.1 204 No Content
```

```text
응답 body 없음
```

#### 404 Not Found

요청 데이터가 DB에 없는 경우

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "PRODUCT_NOT_FOUND",
  "message": "요청한 상품을 찾을 수 없습니다."
}
```

---

## 장바구니

## 장바구니 상품 목록 조회

장바구니에 담긴 상품 목록을 조회할 수 있다.

```http
GET /cart
```

### Response

#### 200 OK

데이터 조회 성공 후 조회 데이터 반환

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "productId": 10,
    "name": "콜라",
    "quantity": 2,
    "stock": 10,
    "imageUrl": "https://example.com/images/cola.png",
    "price": 1500
  },
  {
    "id": 2,
    "productId": 11,
    "name": "사이다",
    "quantity": 1,
    "stock": 5,
    "imageUrl": "https://example.com/images/cider.png",
    "price": 1400
  }
]
```

#### 204 No Content

데이터 조회에 성공했지만 반환할 데이터 없음

```http
HTTP/1.1 204 No Content
```

```text
응답 body 없음
```

---

## 장바구니 상품 수량 변경

id와 수량을 이용해 장바구니 상품의 수량을 변경한다.  
수량은 1개 이상 현재 재고 이하여야 한다.

```http
PATCH /cart/:id
Content-Type: application/json
```

### Request

#### Path Variable

| 이름 | 타입   | 필수 | 설명             |
| ---- | ------ | ---: | ---------------- |
| id   | number |    O | 장바구니 상품 id |

#### Request Body

```json
{
  "quantity": 2
}
```

| 필드     | 타입   | 필수 | 조건                         |
| -------- | ------ | ---: | ---------------------------- |
| quantity | number |    O | 1 이상 현재 재고 이하의 정수 |

### Response

#### 204 No Content

장바구니 상품 수량 수정 성공

```http
HTTP/1.1 204 No Content
```

```text
응답 body 없음
```

#### 400 Bad Request

quantity 검증에 실패한 경우  
예: quantity가 없거나, 숫자가 아니거나, 1보다 작은 경우

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

quantity가 1보다 작은 경우

```json
{
  "code": "INVALID_CART_ITEM_QUANTITY",
  "message": "장바구니 상품 수량은 1개 이상이어야 합니다."
}
```

quantity가 없는 경우

```json
{
  "code": "REQUIRED_CART_ITEM_QUANTITY",
  "message": "장바구니 상품 수량은 필수입니다."
}
```

quantity가 숫자가 아닌 경우

```json
{
  "code": "INVALID_CART_ITEM_QUANTITY_TYPE",
  "message": "장바구니 상품 수량은 숫자여야 합니다."
}
```

#### 404 Not Found

요청 데이터가 DB에 없는 경우

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "CART_ITEM_NOT_FOUND",
  "message": "장바구니 상품을 찾을 수 없습니다."
}
```

#### 409 Conflict

quantity가 현재 재고보다 많은 경우

```http
HTTP/1.1 409 Conflict
Content-Type: application/json
```

```json
{
  "code": "OUT_OF_STOCK",
  "message": "요청한 수량이 현재 재고보다 많습니다."
}
```

---

## 장바구니 상품 삭제

id를 이용해 장바구니의 상품을 제거한다.

```http
DELETE /cart/:id
```

### Request

#### Path Variable

| 이름 | 타입   | 필수 | 설명                    |
| ---- | ------ | ---: | ----------------------- |
| id   | number |    O | 삭제할 장바구니 상품 id |

### Response

#### 204 No Content

상품 제거 성공

```http
HTTP/1.1 204 No Content
```

```text
응답 body 없음
```

#### 404 Not Found

요청 데이터가 DB에 없는 경우

```http
HTTP/1.1 404 Not Found
Content-Type: application/json
```

```json
{
  "code": "CART_ITEM_NOT_FOUND",
  "message": "장바구니 상품을 찾을 수 없습니다."
}
```
