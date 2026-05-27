## 1. 요구사항 명세

- 상품
  - 상품 목록을 조회할 수 있다.
  - 상품을 추가할 수 있다.
  - 상품을 삭제할 수 있다.
  - 해당 상품이 장바구니에 있으면 함께 제거한다.
- 장바구니
  - 장바구니에 상품을 담을 수 있다.
  - 이미 장바구니에 담긴 상품을 다시 담으면 기존 장바구니 항목의 수량을 증가시킨다.
  - 장바구니에 담긴 상품 목록을 조회할 수 있다.
  - 장바구니 상품의 수량을 변경할 수 있다.
  - 장바구니에 담긴 상품을 제거할 수 있다.

## 2. 기능 명세서

### 2-1. 기능 명세

> userId: 유저 식별 id <br>
> productId: 상품 식별 id <br>
> cartItemId: 장바구니에 담긴 상품 항목 식별 id

- 상품 목록을 조회할 수 있다.
  - `GET /products` 요청
  - 저장된 모든 상품을 조회한다.
  - 상품이 없으면 빈 배열을 응답한다.
- 상품을 추가할 수 있다.
  - `POST /products` 요청 {productName, productPrice, remainingQuantity, imageUrl}
- 상품을 삭제할 수 있다.
  - `DELETE /products/:productId` 요청
  - 해당 상품이 장바구니에 있으면 함께 제거한다.
- 장바구니에 상품을 담을 수 있다.
  - `POST /users/:userId/cart/items` 요청 {productId, purchaseQuantity}
  - 이미 장바구니에 담긴 상품을 다시 담으면 기존 장바구니 항목의 수량을 증가시킨다.
- 장바구니에 담긴 상품 목록을 조회할 수 있다.
  - `GET /users/:userId/cart/items` 요청
  - 장바구니에 담긴 상품이 없으면 빈 배열을 응답한다.
- 장바구니 상품의 수량을 변경할 수 있다.
  - `PATCH /users/:userId/cart/items/:cartItemId` 요청 {purchaseQuantity}
- 장바구니에 담긴 상품을 제거할 수 있다.
  - `DELETE /users/:userId/cart/items/:cartItemId` 요청

### 2-2. 검증

- 필수 필드 누락 시 에러를 응답한다.
- 존재하지 않는 유저/상품/장바구니 아이템 요청 시 에러를 응답한다.
- remainingQuantity는 1 이상 99 이하의 정수여야 한다.
- purchaseQuantity는 1 이상 99 이하의 정수여야 한다.
- productPrice는 0보다 큰 숫자여야 한다.
- productName은 공백이 아니며 최대 100자이다.
- imageUrl은 선택 값이며, 값이 있으면 유효한 이미지 경로여야 한다.
- 장바구니에 담거나 변경하려는 수량은 상품의 남은 수량보다 많을 수 없다.
- 장바구니 총 금액은 저장하지 않고 상품 가격, 구매 수량, 배송비 정책으로 계산한다.

## 3. 폴더 구조

```
server/src
├── app.ts
├── index.ts
├── modules
│   ├── products
│   │   ├── product.model.ts
│   │   ├── product.controller.ts
│   │   ├── product.routes.ts
│   │   ├── product.service.ts
│   │   └── product.repository.ts
│   └── cart
│       ├── cart.model.ts
│       ├── cart.controller.ts
│       ├── cart.routes.ts
│       ├── cart.service.ts
│       └── cart.repository.ts
├── middlewares
│   └── errorHandler.ts
└── errors
    └── AppError.ts
```

### Clean Architecture 레이어별 역할

#### 파일별 역할 정리

| 레이어           | 파일                          | 역할                                         | 의존 대상            |
| ---------------- | ----------------------------- | -------------------------------------------- | -------------------- |
| **Entity**       | `product.model.ts`            | 도메인 규칙 캡슐화 (재고 검증, 가격 계산 등) | 없음                 |
| **Controller**   | `product.controller.ts`       |                                              | 없음                 |
| **Repository**   | `product.repository.ts`       | DB 접근, Entity ↔ DB row 변환                | DB 드라이버          |
| **Service**      | `product.service.ts`          | Use Case 조율, Entity와 Repository 연결      | Entity, Repository   |
| **Routes**       | `product.routes.ts`           | HTTP 요청/응답 처리, 입력 파싱               | Service              |
| **AppError**     | `errors/AppError.ts`          | 구조화된 에러 객체 정의                      | 없음                 |
| **errorHandler** | `middlewares/errorHandler.ts` | 에러를 HTTP 응답으로 변환                    | AppError             |
| **app.ts**       | `app.ts`                      | Express 설정, 미들웨어/라우터 등록           | Routes, errorHandler |
| **index.ts**     | `index.ts`                    | 서버 시작, 포트 리스닝                       | app.ts               |

#### 의존 방향 흐름

```
index.ts
  → app.ts
    → routes      (HTTP 처리)
      → service   (조율)
        → model   (도메인 규칙 판단)
        → repository (DB 접근)
          → model (DB row → Entity 변환)
```

> 핵심은 **model이 아무것도 의존하지 않는다**는 것.
> 가장 안쪽에 위치하고 단독 테스트가 가능하다.
