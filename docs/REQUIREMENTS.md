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
  - 장바구니 상품 금액, 배송비, 총 결제 금액을 조회할 수 있다.
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
- 장바구니 금액 요약을 조회할 수 있다.
  - `GET /users/:userId/cart/summary` 요청
  - {orderAmount, deliveryFee, totalPaymentAmount, freeDeliveryThreshold}
  - `cartItemIds` query parameter를 전달하면 해당 장바구니 상품만 기준으로 금액을 계산한다.
  - `cartItemIds`를 전달하지 않으면 장바구니 전체 상품을 기준으로 금액을 계산한다.
  - 상품 금액 합계가 무료 배송 기준 금액 이상이면 배송비는 0원이다.
  - 상품 금액 합계가 0원이면 배송비와 총 결제 금액도 0원이다.
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
