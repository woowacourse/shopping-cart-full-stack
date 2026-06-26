# Route

- GET /products
- POST /products
- DELETE /products/:id
- GET /cart
- PATCH /cart/:id
- DELETE /cart/:id

# App

## app.ts

> Express app 설정과 route 연결을 담당한다.
> 별도 routes 디렉터리는 없고 `app.ts`에서 controller를 바로 연결한다.

### middlewares

- cors
  - origin: github.io, localhost:5173
  - methods: GET, POST, PATCH, DELETE
  - credentials: true
- express.json()
- validateProductId
- validateCartItemId
- notFoundHandler
- errorHandler

### routes

```
GET /products -> getProducts
POST /products -> createProduct
DELETE /products/:id -> validateProductId -> deleteProduct

GET /cart -> getCartItems
PATCH /cart/:id -> validateCartItemId -> updateCartItemQuantity
DELETE /cart/:id -> validateCartItemId -> deleteCartItem
```

# Controllers

## products.controller

> Product HTTP 요청/응답을 담당한다.
> request body는 schema로 parse하고, 비즈니스 로직은 service로 넘긴다.

### createProduct

- createProductRequestSchema.parse(request.body)
- addProduct(dto)
- response.status(201).end()

### getProducts

- fetchProducts()
- response.status(200).json(productList)

### deleteProduct

- id = Number(request.params.id)
- removeProduct(id)
- response.status(204).end()

## cart.controller

> Cart HTTP 요청/응답을 담당한다.
> request body는 schema로 parse하고, 비즈니스 로직은 service로 넘긴다.

### getCartItems

- fetchCartItems()
- response.status(200).json({ data: cartItemList })

### updateCartItemQuantity

- id = Number(request.params.id)
- updateCartItemRequestSchema.parse(request.body)
- modifyCartItemQuantity(id, quantity)
- response.status(204).end()

### deleteCartItem

- id = Number(request.params.id)
- removeCartItem(id)
- response.status(204).end()

# Services

## products.service

> Product 비즈니스 로직을 담당한다.
> repository를 호출하고, 실패 조건은 AppError로 표현한다.

### functions

- addProduct(product)
  - save(product)
- getProducts()
  - findAll()
- deleteProduct(id)
  - isAlreadyExist(id)가 false라면 PRODUCT_NOT_FOUND
  - deleteById(id)
  - deleteByProductId(id) // 상품 삭제 시 장바구니에서도 제거

## cart.service

> Cart 비즈니스 로직과 응답 view model 생성을 담당한다.
> cart item에 product 정보를 합치고, 재고 상태를 계산한다.

### variables

- CART_ITEM_STATUS.AVAILABLE = "available"
- CART_ITEM_STATUS.OUT_OF_STOCK = "outOfStock"
- CART_ITEM_STATUS.QUANTITY_EXCEEDED = "quantityExceeded"

### functions

- getCartItemStatus(quantity, stock)
  - stock이 0이면 OUT_OF_STOCK
  - quantity가 stock보다 크면 QUANTITY_EXCEEDED
  - 나머지는 AVAILABLE
- toCartItemResponse(item, product)
  - cart item + product(name, price, stock, imageUrl)
  - status 계산
- toCartItemResponseOrEmpty(item)
  - product가 없으면 빈 배열
  - 있으면 CartItemResponse 배열
- getCartItems()
  - findAll()
  - flatMap(toCartItemResponseOrEmpty)
- updateCartItemQuantity(id, quantity)
  - findProductIdById(id)가 -1이면 CART_ITEM_NOT_FOUND
  - findStockById(productId)가 -1이면 PRODUCT_NOT_FOUND
  - quantity가 stock보다 크고 기존 수량보다도 크면 OUT_OF_STOCK
  - updateItemQuantity(id, quantity)
- deleteCartItem(id)
  - isAlreadyExist(id)가 false라면 CART_ITEM_NOT_FOUND
  - deleteById(id)

# Repositories

## products.repository

> Product in-memory store.
> 초기 seed 배열을 복사해서 사용한다.

### data

- initialProducts
- products = [...initialProducts]

### functions

- isAlreadyExist(id)
- save(product)
  - 마지막 id + 1로 새 id 생성
  - products.push(newProduct)
- findAll()
  - products 복사본 반환
- findStockById(id)
  - 없으면 -1
- findById(id)
- deleteById(id)
  - 없으면 false
  - 있으면 splice 후 true
- reset()
  - products.length = 0

## cart.repository

> Cart in-memory store.
> 초기 seed 배열을 복사해서 사용한다.

### data

- initialCartItems
- cartItems = [...initialCartItems]

### functions

- isAlreadyExist(id)
- saveNewItem(newItem)
  - 마지막 id + 1로 새 id 생성
  - cartItems.push({ id, ...newItem })
- updateItemQuantity(id, quantity)
- deleteById(id)
  - 없으면 false
  - 있으면 splice 후 true
- deleteByProductId(productId)
  - 상품 삭제 시 연결된 cart item 제거
- findAll()
  - cartItems 복사본 반환
- findProductIdById(id)
  - 없으면 -1
- findQuantityById(id)
  - 없으면 -1
- reset()
  - cartItems.length = 0

# Schemas

## product.schema

> Product request/response schema를 담당한다.
> `utils/z.ts`의 커스텀 z 유틸을 사용한다.

### createProductRequestSchema

- name
  - string
  - min(1): REQUIRED_PRODUCT_NAME
  - max(100): INVALID_PRODUCT_NAME
- stock
  - number
  - int: INVALID_PRODUCT_STOCK
  - min(1): INVALID_PRODUCT_STOCK
  - max(99): INVALID_PRODUCT_STOCK
- imageUrl
  - string
  - min(1): REQUIRED_PRODUCT_IMAGE
- price
  - number
  - positive: INVALID_PRODUCT_PRICE

### productListResponseSchema

- Product response 배열

## cart.schema

> Cart request schema를 담당한다.

### updateCartItemRequestSchema

- quantity
  - number: REQUIRED_CART_ITEM_QUANTITY
  - min(1): INVALID_CART_ITEM_QUANTITY

# Interfaces

## product.interface

### DTO

- CreateProductDto = z.infer<typeof createProductRequestSchema>

### types

- newProduct = Omit<Product, "id">

### Product

- id
- name
- stock
- imageUrl
- price

## cart.interface

### DTO

- UpdateCartItemDto = z.infer<typeof updateCartItemRequestSchema>

### types

- newCartItem = Omit<CartItem, "id">
- CartItemStatus
- UpdateResultKey

### CartItem

- id
- productId
- quantity

### CartItemResponse

- id
- name
- price
- quantity
- stock
- status
- imageUrl

# Middlewares

## validateId

### validateProductId

- Number(request.params.id)가 NaN이면 400
- ERROR_RESPONSE.INVALID_PRODUCT_ID 반환
- 아니면 next()

### validateCartItemId

- Number(request.params.id)가 NaN이면 400
- ERROR_RESPONSE.INVALID_CART_ITEM_ID 반환
- 아니면 next()

## notFoundHandler

- 매칭되는 route가 없으면 AppError("NOT_FOUND", 404)를 next로 전달

## errorHandler

> 마지막 error middleware.
> ZodError와 AppError를 ERROR_RESPONSE로 변환한다.

### ZodError

- error.issues[0]?.message를 errorCode로 사용
- ERROR_RESPONSE[errorCode]
- status 400

### AppError

- error.status
- ERROR_RESPONSE[error.code]

### unknown error

- status 500
- INTERNAL_SERVER_ERROR

# Errors

## AppError

> service와 middleware에서 의도한 에러를 표현할 때 사용한다.

### props

- code: keyof typeof ERROR_RESPONSE
- status: number

## ERROR_RESPONSE

> 서버 에러 응답의 단일 출처.

### product

- REQUIRED_PRODUCT_NAME
- REQUIRED_PRODUCT_PRICE
- REQUIRED_PRODUCT_STOCK
- REQUIRED_PRODUCT_IMAGE
- INVALID_PRODUCT_NAME
- INVALID_PRODUCT_PRICE
- INVALID_PRODUCT_STOCK
- INVALID_PRODUCT_IMAGE
- INVALID_PRODUCT_ID
- PRODUCT_NOT_FOUND

### cart

- INVALID_CART_ITEM_ID
- CART_ITEM_NOT_FOUND
- REQUIRED_CART_ITEM_QUANTITY
- INVALID_CART_ITEM_QUANTITY
- OUT_OF_STOCK

### common

- INVALID_REQUEST_BODY
- NOT_FOUND
- INTERNAL_SERVER_ERROR

# Utils

## z

> zod와 비슷한 커스텀 validation 유틸.
> schema의 parse가 실패하면 ZodError를 던진다.

### z.string

- min(n, message)
- max(n, message)
- parse(val)

### z.number

- min(n, message)
- max(n, message)
- int(message)
- positive(message)
- parse(val)

### z.object

- shape의 key별 schema.parse 실행
- parse(val)

### z.array

- item별 schema.parse 실행
- parse(val)

### ZodError

- issues: Array<{ message: string }>

### infer

- schema.parse 반환 타입 추론

# Rules

## Controller

- HTTP request/response 처리
- request body schema parse
- service 호출
- 성공 status 반환

## Service

- 비즈니스 로직 처리
- repository 조합
- AppError throw
- 응답 view model 생성

## Repository

- in-memory data 접근
- 데이터 조회/저장/수정/삭제
- 비즈니스 에러를 직접 던지지 않음

## Schema

- request body 구조 검증
- 실패 시 ERROR_RESPONSE code를 ZodError message로 전달

## Middleware

- route param 검증
- 404 변환
- 에러 응답 변환
