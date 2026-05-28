## API 명세

### 상품 (Products)

| Domain | Method | Endpoint | Description | Path Params | Query Params | Request Body | Status Code | Response Description | Response Body |
|--------|--------|----------|-------------|-------------|--------------|--------------|-------------|----------------------|---------------|
| 상품 | GET | `/products` | 상품 목록 조회 | - | - | - | 200 | 정상 조회 | `{ status: 200, data: { id: number, price: number, name: string, imgUrl: string }[] }` |
| 상품 | POST | `/products` | 상품 추가 | - | - | `{ price: number, name: string, imgUrl: string }` | 201 | 모든 필수값이 존재하고 타입과 도메인 규칙까지 일치하는 경우 | `{ status: 201, data: { id: number, price: number, name: string, imgUrl: string } }` |
| | | | | | | | 400 | `price`, `name`, `imgUrl` 중 하나라도 누락된 경우 | `{ status: 400, errorCode: "MISSING_FIELD", errorMessage: string, data: [{ type: string, errorCode: string }] }` |
| | | | | | | | 400 | `price`, `name`, `imgUrl` 중 하나라도 도메인 규칙에 맞지 않는 값이 포함된 경우 | `{ status: 400, errorCode: "INVALID", errorMessage: string, data: [{ type: string, errorCode: string }] }` |
| | | | | | | | 400 | `price`, `name`, `imgUrl` 타입 중 하나라도 불일치하는 경우 | `{ status: 400, errorCode: "TYPE_MISMATCH", errorMessage: string }` |
| | | | | | | | 400 | 요청 body가 JSON 형태가 아닌 경우 | `{ status: 400, errorCode: "NO_JSON", errorMessage: string }` |
| 상품 | DELETE | `/products/:id` | 상품 삭제 | `{ id: number }` | - | - | 204 | 정상적으로 id를 받은 경우 | No Content |
| | | | | | | | 404 | DB에 존재하지 않는 요소에 대한 id를 받은 경우 | `{ status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: string }` |
| | | | | | | | 405 | id 없이 DELETE 요청한 경우 | `{ status: 405, errorCode: "METHOD_NOT_ALLOWED", errorMessage: string }` |


### 장바구니 (Carts)

| Method | Endpoint | Description | Path Params | Query Params | Request Body | Status Code | Response Description | Response Body |
|--------|----------|-------------|-------------|--------------|--------------|-------------|----------------------|---------------|
| GET | `/carts/:cartId` | 장바구니 상품 목록 조회 | `{ cartId: number }` | - | - | 200 | 정상적으로 cartId를 받은 경우 | `{ status: 200, data: { id: number, products: [{ id: number, name: string, price: number, imgUrl: string, quantity: number }] } }` |
| | | | | | | 404 | 존재하지 않는 `cartId`로 조회하는 경우 | `{ status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: string }` |
| | | | | | | 404 | `/carts`로 요청한 경우 | `{ status: 404, errorCode: "ROUTE_NOT_FOUND", errorMessage: string }` |
| PATCH | `/carts/:cartId/products/:productId` | 장바구니 상품 수량 변경 | `{ cartId: number, productId: number }` | - | `{ quantity: number }` | 200 | 정상적으로 params를 받은 경우 | `{ status: 200, data: { id: number, name: string, price: number, imgUrl: string, quantity: number } }` |
| | | | | | | 400 | `quantity`가 누락된 경우 | `{ status: 400, errorCode: "MISSING_FIELD", errorMessage: string, data: [{ type: "quantity", errorCode: string }] }` |
| | | | | | | 400 | `quantity` 타입이 불일치하는 경우 | `{ status: 400, errorCode: "TYPE_MISMATCH", errorMessage: string }` |
| | | | | | | 400 | `quantity`가 1-99 사이가 아닌 경우 (도메인 유효성 에러) | `{ status: 400, errorCode: "INVALID", errorMessage: string, data: [{ type: string, errorCode: string }] }` |
| | | | | | | 400 | 요청 body가 JSON 형태가 아닌 경우 | `{ status: 400, errorCode: "NO_JSON", errorMessage: string }` |
| | | | | | | 404 | `cartId` 또는 `productId`가 누락된 경우 | `{ status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: string }` |
| | | | | | | 404 | 존재하지 않는 `cartId`로 조회하는 경우 | `{ status: 404, errorCode: "ROUTE_NOT_FOUND", errorMessage: string }` |
| | | | | | | 404 | 존재하지 않는 `productId`로 조회하는 경우 | `{ status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: string }` |
| DELETE | `/carts/:cartId/products/:productId` | 장바구니 상품 제거 | `{ cartId: number, productId: number }` | - | - | 204 | 정상적으로 id를 받은 경우 | No Content |
| | | | | | | 400 | `cartId`, `productId` 중 하나라도 타입이 불일치하는 경우 | `{ status: 400, errorCode: "TYPE_MISMATCH", errorMessage: string }` |
| | | | | | | 404 | DB에 존재하지 않는 요소에 대한 id를 받은 경우 | `{ status: 404, errorCode: "RESOURCE_NOT_FOUND", errorMessage: string }` |
| | | | | | | 404 | id가 없는 경우 | `{ status: 404, errorCode: "ROUTE_NOT_FOUND", errorMessage: string }` |
