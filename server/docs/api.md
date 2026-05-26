| Method | Endpoint | Description | Path Params | Query Params | Request Body | Response Body |
|--------|----------|-------------|-------------|--------------|--------------|---------------|
| GET | `/products` | 상품 목록 조회 | - | - | - | **200** `{ status: 200, data: { id: string, price: number, name: string, imgUrl: string }[] }` |
| POST | `/products` | 상품 추가 | - | - | `{ price: number, name: string, imgUrl: string }` | **201** `{ status: 201, data: { id: string, price: number, name: string, imgUrl: string } }` <br> **400** `{ status: 400, errorCode: "INVALID", errorMessage: "...", data: [{ type: string, errorCode: string }] }` |
| DELETE | `/products/:id` | 상품 삭제 | `id: string` | - | - | **204** No Content |