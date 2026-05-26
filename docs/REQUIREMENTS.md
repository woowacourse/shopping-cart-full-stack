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
> cartItemId: 장바구니에 담긴 상품 식별 id

- 상품 목록을 조회할 수 있다.
  - `GET /products` 요청
  - 저장된 모든 상품을 조회한다.
- 상품을 추가할 수 있다.
  - `POST /products` 요청 {name, price, remainingQuantity, imgUrl}
- 상품을 삭제할 수 있다.
  - `DELETE /products/:product_id` 요청
  - 해당 상품이 장바구니에 있으면 함께 제거한다.
- 장바구니에 상품을 담을 수 있다.
  - `POST /users/:user_id/cart/items` 요청 {productId, purchaseQuantity}
  - 이미 장바구니에 담긴 상품을 다시 담으면 기존 장바구니 항목의 수량을 증가시킨다.
- 장바구니에 담긴 상품 목록을 조회할 수 있다.
  - `GET /users/:user_id/cart` 요청
- 장바구니 상품의 수량을 변경할 수 있다.
  - `PATCH /users/:user_id/cart/items/:item_id` 요청 {purchaseQuantity}
- 장바구니에 담긴 상품을 제거할 수 있다.
  - `DELETE /users/:user_id/cart/items/:item_id` 요청

### 2-2. 검증

- 필수 필드 누락 시 에러를 응답한다.
- 존재하지 않는 상품/장바구니 아이템 요청 시 에러를 응답한다.
- quantity는 1 이상 99 이하의 정수여야 한다.
- price는 0보다 큰 숫자여야 한다.
- 상품명은 최대 100자이다.

## 3. 폴더 구조

```
server/src
├── app.ts
├── index.ts
├── modules
│   ├── products
│   │   ├── product.routes.ts
│   │   ├── product.service.ts
│   │   └── product.repository.ts
│   └── carts
│       ├── cart.routes.ts
│       ├── cart.service.ts
│       └── cart.repository.ts
├── middlewares
│   └── errorHandler.ts
└── errors
    └── AppError.ts
```
