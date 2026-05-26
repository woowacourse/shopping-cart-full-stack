## 상품

|기능|Method|URL|Request|Response
|------|---|---|---|---|
|상품 목록 조회|GET|/api/products/|X|[{ "id": 1, "name": "수건", "thumbnail": "/some_image2", price: 10000 },{"id": 2, "name": "양말", "thumbnail": "/some_image", price: 3000},]
|상품 추가|POST|/api/products/|{ "name": "치킨", "thumbnail": "chicken.png", "price": 5000}|{"id" : 3}
|상품 삭제|DELETE|/api/products/id/|X|X|

## 장바구니

|기능|Method|URL|Request|Response
|------|---|---|---|---|
|목록 조회|GET|/api/cart/|X|[{"id": 1, "product_id": 1, "quantity": 20}, {"id": 2, "product_id": 5, "quantity": 10}, ...]
|특정 상품 수량 변경|PATCH|/api/cart/items/id/|{"quantity": 15}|{"id": 1, "product_id": 1, "quantity": 15}|
|특정 상품 삭제|DELETE|/api/cart/items/id/|X|X|