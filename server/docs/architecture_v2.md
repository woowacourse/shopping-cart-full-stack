# Route

- POST /checkouts
- GET /checkouts/:checkoutId
- DELETE /checkouts/:checkoutId
- PATCH /checkouts/:checkoutId/address
- PATCH /checkouts/:checkoutId/coupons
- GET /checkouts/:checkoutId/coupons/discount-preview
- POST /checkouts/:checkoutId/payment

# App

## app.ts

### middlewares

- validateCheckoutId

### routes

```txt
POST /checkouts -> createCheckout
GET /checkouts/:checkoutId -> validateCheckoutId -> getCheckout
DELETE /checkouts/:checkoutId -> validateCheckoutId -> deleteCheckout
PATCH /checkouts/:checkoutId/address -> validateCheckoutId -> updateCheckoutAddress
PATCH /checkouts/:checkoutId/coupons -> validateCheckoutId -> updateCheckoutCoupons
GET /checkouts/:checkoutId/coupons/discount-preview -> validateCheckoutId -> getCouponDiscountPreview
POST /checkouts/:checkoutId/payment -> validateCheckoutId -> payCheckout
```

### startup

- startCheckoutCleanupScheduler()
  - 서버 시작 시 1회 실행
  - 오래된 CHECKOUT_DB rows를 주기적으로 정리

# Controllers

> [v1](./architecture.md) 포함.

## checkout.controller

> Checkout HTTP 요청/응답을 담당한다.
> request body와 query string은 schema로 parse하고, 비즈니스 로직은 service로 넘긴다.

### functions

- createCheckout(request, response)
  - createCheckoutRequestSchema.parse(request.body)
  - checkoutService.createCheckout(dto)
  - status 201
  - `{ checkout_id }` 반환
- getCheckout(request, response)
  - Number(request.params.checkoutId)
  - checkoutService.getCheckout(checkoutId)
  - status 200
- deleteCheckout(request, response)
  - Number(request.params.checkoutId)
  - checkoutService.deleteCheckout(checkoutId)
  - status 204
- updateCheckoutAddress(request, response)
  - updateCheckoutAddressRequestSchema.parse(request.body)
  - checkoutService.updateCheckoutAddress(checkoutId, dto)
  - status 204
- updateCheckoutCoupons(request, response)
  - updateCheckoutCouponsRequestSchema.parse(request.body)
  - checkoutService.updateCheckoutCoupons(checkoutId, dto)
  - status 204
- getCouponDiscountPreview(request, response)
  - couponDiscountPreviewQuerySchema.parse(request.query)
  - checkoutService.getCouponDiscountPreview(checkoutId, query)
  - status 200
- payCheckout(request, response)
  - payCheckoutRequestSchema.parse(request.body)
  - checkoutService.payCheckout(checkoutId, dto)
  - status 200

# Services

## checkout.service

> Checkout 비즈니스 로직과 응답 view model 생성을 담당한다.
> DB에는 결제 전 임시 주문의 상품 id와 수량만 저장하고, 상품 정보와 금액은 조회/결제 시 PRODUCT_DB 기준으로 계산한다.

### constants

- MAX_COUPON_COUNT = 2
- BTGO_MIN_QUANTITY = 3
- FREE_SHIPPING_THRESHOLD = 100000
- SHIPPING_FEE = 3000
- REMOTE_AREA_FEE = 3000

### functions

- createCheckout(dto)
  - 수량 범위는 createCheckoutRequestSchema에서 검증
  - dto.items에 같은 product_id가 2개 이상 있으면 `INVALID_REQUEST_BODY`
  - dto.items의 product_id로 CART_DB에 존재하는 장바구니 상품인지 확인
    - 장바구니 상품이 아니면 `CART_ITEM_NOT_FOUND`
  - PRODUCT_DB에서 상품 조회
    - 상품이 없으면 `PRODUCT_NOT_FOUND`
    - 요청 수량이 현재 재고보다 크면 `OUT_OF_STOCK`
  - CHECKOUT_DB 생성
    - remote_area = false
    - created_at = now
  - CHECKOUT_ITEM_DB에 임시 주문 상품 저장
    - product_id
    - quantity
  - COUPON_DB에서 전체 쿠폰 목록 조회
  - PRODUCT_DB의 현재 price 기준으로 checkoutAmount 계산
  - calculateShippingFee(checkoutAmount, false)로 shippingFee 계산
  - findBestCouponCombination(coupons, { items, shippingFee, now }) 호출
    - MAX_COUPON_COUNT 이하 조합 중 coupon_discount가 가장 큰 조합 선택
    - 조건을 만족하는 쿠폰이 없으면 선택 쿠폰 없음
  - 선택된 coupon_id 목록을 CHECKOUT_COUPON_DB에 저장
  - `{ checkout_id }` 반환

- getCheckout(checkoutId)
  - CHECKOUT_DB가 없으면 `CHECKOUT_NOT_FOUND`
  - CHECKOUT_ITEM_DB 목록 조회
  - PRODUCT_DB를 참조해 상품명/가격/이미지를 조회
    - 상품이 없으면 `PRODUCT_NOT_FOUND`
  - checkout_amount 계산
    - PRODUCT_DB의 현재 price 기준
    - sum(product.price \* item.quantity)
  - COUPON_DB에서 전체 쿠폰 목록 조회
  - CHECKOUT_COUPON_DB에서 현재 선택된 coupon_id 목록 조회
    - checkout 생성 직후에는 서버가 계산한 최대혜택 쿠폰 조합
    - 사용자가 PATCH /checkouts/:checkoutId/coupons로 변경하면 수동 선택 조합
  - GET 요청이지만 프론트 선택 상태 일관성을 위해 무효 선택 쿠폰을 정리한다.
  - 현재 checkoutAmount 기준 조건을 만족하지 못하는 선택 쿠폰은 CHECKOUT_COUPON_DB에서 삭제
    - 응답에서는 is_selected=false, disabled=true
  - coupons 응답 생성
    - is_selected: 정리 후 CHECKOUT_COUPON_DB에 남은 coupon_id면 true
    - disabled: 현재 checkoutAmount 기준 validateCouponCondition이 false면 true
  - coupon_discount 계산
    - 정리 후 CHECKOUT_COUPON_DB에 남은 선택 쿠폰 기준
  - calculateShippingFee(checkoutAmount, remoteArea)로 shipping_fee 계산
  - total_amount 계산
    - checkout_amount - coupon_discount + shipping_fee
  - CheckoutDetailResponse 반환

- deleteCheckout(checkoutId)
  - CHECKOUT_DB가 없으면 `CHECKOUT_NOT_FOUND`
  - CHECKOUT_COUPON_DB 삭제
  - CHECKOUT_ITEM_DB 삭제
  - CHECKOUT_DB 삭제

- updateCheckoutAddress(checkoutId, dto)
  - CHECKOUT_DB가 없으면 `CHECKOUT_NOT_FOUND`
  - CHECKOUT_DB.remote_area 수정

- updateCheckoutCoupons(checkoutId, dto)
  - CHECKOUT_DB가 없으면 `CHECKOUT_NOT_FOUND`
  - dto.coupons가 null 또는 빈 배열이면
    - CHECKOUT_COUPON_DB rows 전체 삭제
    - 종료
  - CHECKOUT_ITEM_DB 목록 조회
  - PRODUCT_DB의 현재 price 기준으로 checkoutAmount 재계산
  - getValidCoupons(dto.coupons, { checkoutAmount, items, now }) 호출
  - 기존 CHECKOUT_COUPON_DB rows 삭제
  - 선택한 coupon_id 목록을 CHECKOUT_COUPON_DB에 저장

- getCouponDiscountPreview(checkoutId, query)
  - CHECKOUT_DB가 없으면 `CHECKOUT_NOT_FOUND`
  - couponIds가 없으면 즉시 `{ coupon_discount: 0 }` 반환
  - CHECKOUT_ITEM_DB 목록 조회
  - PRODUCT_DB의 현재 price 기준으로 checkoutAmount 재계산
    - sum(product.price \* item.quantity)
  - calculateShippingFee(checkoutAmount, CHECKOUT_DB.remote_area)로 shippingFee 계산
  - couponIds가 있으면 getValidCoupons(couponIds, { checkoutAmount, items, now }) 호출
    - MAX_COUPON_COUNT 초과면 `INVALID_COUPON_CONDITION`
    - 존재하지 않는 쿠폰이면 `COUPON_NOT_FOUND`
    - 쿠폰 조건을 만족하지 못하면 `INVALID_COUPON_CONDITION`
  - 재계산한 checkoutAmount와 shippingFee로 calculateCouponDiscount 호출
  - 예상 coupon_discount 반환

- payCheckout(checkoutId, dto)
  - 결제 최종 확정에 필요한 조회/검증/변경을 하나의 transaction에서 처리
    - CHECKOUT_DB 조회
      - 없으면 `CHECKOUT_NOT_FOUND`
    - CHECKOUT_DB.remote_area를 dto.remote_area로 최종 반영
    - CHECKOUT_ITEM_DB 목록 조회
    - PRODUCT_DB에서 현재 상품 조회
      - 상품이 없으면 `PRODUCT_NOT_FOUND`
    - 현재 PRODUCT_DB price 기준으로 checkout_amount 재계산
    - calculateShippingFee(checkoutAmount, remoteArea)로 shipping_fee 재계산
    - dto.coupons가 null 또는 빈 배열이면
      - CHECKOUT_COUPON_DB rows 전체 삭제
      - 최종 선택 쿠폰은 빈 배열로 처리
    - dto.coupons가 있으면
      - getValidCoupons(dto.coupons, { checkoutAmount, items, now }) 호출
      - dto.coupons의 coupon_id를 최종 선택값으로 보고 CHECKOUT_COUPON_DB를 replace
    - 최종 선택된 coupon_id 기준으로 coupon_discount 계산
    - 결제 요청에는 금액이 없으므로 클라이언트 금액과 비교하지 않음
    - 재계산한 total_amount를 최종 결제 금액으로 사용
    - 모든 CHECKOUT_ITEM_DB.quantity가 현재 재고 이하인지 먼저 검증
      - 하나라도 재고가 부족하면 `OUT_OF_STOCK`
    - 모든 item 검증이 통과하면 PRODUCT_DB.stock 일괄 차감
    - CART_DB에서 결제된 상품 제거
    - CHECKOUT_COUPON_DB 삭제
    - CHECKOUT_ITEM_DB 삭제
    - CHECKOUT_DB 삭제
  - 성공하면 transaction commit
  - 중간에 실패하면 transaction rollback
  - 결제 성공 후 같은 checkoutId로 재요청하면 `CHECKOUT_NOT_FOUND`
  - PaymentResultResponse 반환

## coupon.service

> 쿠폰 조건 검증과 할인 금액 계산을 담당한다.

### functions

- validateCouponCondition(coupon, context)
  - context = { checkoutAmount, items, now }
  - expired_date가 지났으면 `false`
  - min_order_amount보다 checkoutAmount가 작으면 `false`
  - checkoutAmount는 쿠폰 할인 전 상품 금액 기준
  - usable_start_at/usable_end_at 범위 밖이면 `false`
  - BTGO인데 같은 상품을 BTGO_MIN_QUANTITY(3)개 이상 담은 종류가 하나도 없으면 `false`
    - 상품별 수량 기준이며 서로 다른 상품 수량은 합산하지 않는다
    - 무료 증정 가능한 상품이 없으면 혜택이 0이므로 사용 불가
  - 나머지는 `true`
- getValidCoupons(couponIds, context)
  - context = { checkoutAmount, items, now }
  - couponIds가 MAX_COUPON_COUNT보다 많으면 `INVALID_COUPON_CONDITION`
  - COUPON_DB에서 couponIds 조회
  - 존재하지 않는 쿠폰이면 `COUPON_NOT_FOUND`
  - validateCouponCondition이 false인 쿠폰이 있으면 `INVALID_COUPON_CONDITION`
  - 검증된 Coupon 목록 반환
- calculateCouponDiscount(coupons, context)
  - context = { items, shippingFee }
  - BTGO, FIXED, FREESHIPPING은 같은 우선순위로 선적용
  - BTGO: 같은 상품 3개당 1개를 그 상품 단가로 무료 처리
    - 상품별로 floor(quantity / 3) × price 합산 (서로 다른 상품 수량은 합산하지 않음)
    - 예: 상품 A 3개 → A 1개 무료, 상품 A 6개 → A 2개 무료
  - FIXED: amount만큼 할인
  - FREESHIPPING: shippingFee만큼 할인
    - 무료배송 조건으로 shippingFee가 0이면 FREESHIPPING 할인액도 0
  - RATE는 마지막에 적용
  - RATE: BTGO/FIXED 적용 이후 남은 상품 금액 기준으로 rate 할인
  - 총 할인 금액은 checkoutAmount + shippingFee를 넘지 않음
- findBestCouponCombination(coupons, context)
  - context = { items, shippingFee, now }
  - 조건을 만족하는 쿠폰만 대상으로 계산
  - MAX_COUPON_COUNT 이하 모든 조합의 coupon_discount 계산
  - coupon_discount가 가장 큰 조합 반환
  - 할인 가능한 조합이 없으면 빈 배열 반환

## shipping.service

> 배송비 계산을 담당한다.

### functions

- calculateShippingFee(checkoutAmount, remoteArea)
  - checkoutAmount는 쿠폰 할인 전 상품 금액 기준
  - checkoutAmount가 FREE_SHIPPING_THRESHOLD 이상이면 0
  - 아니면 SHIPPING_FEE + remoteArea 여부에 따른 REMOTE_AREA_FEE

# Repositories

## checkout.repository

> CHECKOUT_DB 접근을 담당한다.

### functions

- create({ remoteArea })
- findById(id)
- updateRemoteArea(id, remoteArea)
- deleteById(id)
- findIdsOlderThan(expiredAt)

## checkoutItem.repository

> CHECKOUT_ITEM_DB 접근을 담당한다.

### functions

- bulkCreate(checkoutId, items)
- findAllByCheckoutId(checkoutId)
- deleteByCheckoutId(checkoutId)

## checkoutCoupon.repository

> CHECKOUT_COUPON_DB 접근을 담당한다.

### functions

- replaceByCheckoutId(checkoutId, couponIds)
  - 기존 rows 삭제 후 bulk insert
  - unique(checkout_id, coupon_id)로 중복 방지
- findAllByCheckoutId(checkoutId)
- deleteByCheckoutId(checkoutId)

## coupon.repository

> COUPON_DB 조회를 담당한다.

### functions

- findAllByIds(ids)

# Schemas

## checkout.schema

> Checkout request/query/response schema를 담당한다.

### createCheckoutRequestSchema

- items
  - array
  - minLength(1): INVALID_REQUEST_BODY
- items[].product_id
  - number: INVALID_REQUEST_BODY
  - int: INVALID_REQUEST_BODY
  - positive: INVALID_REQUEST_BODY
- items[].quantity
  - number: INVALID_QUANTITY
  - int: INVALID_QUANTITY
  - min(1): INVALID_QUANTITY
  - max(99): INVALID_QUANTITY

### updateCheckoutAddressRequestSchema

- remote_area
  - boolean: INVALID_REQUEST_BODY

### updateCheckoutCouponsRequestSchema

- coupons
  - number[] | null
  - null이면 전체 해제
  - 배열이면 각 값은 positive int

### couponDiscountPreviewQuerySchema

- couponIds
  - number[] | undefined
  - 단일 query 값도 number[]로 정규화

### payCheckoutRequestSchema

- remote_area
  - boolean: INVALID_REQUEST_BODY
- coupons
  - number[] | null
  - null이면 전체 해제

### naming

- HTTP request/response body는 API 명세와 맞춰 snake_case 사용
- server 내부 DTO/interface/service 인자는 TypeScript 컨벤션에 맞춰 camelCase 사용
- controller 또는 serializer/mapper에서 snake_case와 camelCase를 변환

# Interfaces

## checkout.interface

### DTO

- CreateCheckoutDto = z.infer<typeof createCheckoutRequestSchema>
- UpdateCheckoutAddressDto = z.infer<typeof updateCheckoutAddressRequestSchema>
- UpdateCheckoutCouponsDto = z.infer<typeof updateCheckoutCouponsRequestSchema>
- CouponDiscountPreviewQuery = z.infer<typeof couponDiscountPreviewQuerySchema>
- PayCheckoutDto = z.infer<typeof payCheckoutRequestSchema>

### Checkout

- id
- remoteArea
- createdAt

### CheckoutItem

- id
- checkoutId
- productId
- quantity

### CheckoutItemResponse

- productId
- name
- price
- imageUrl
- quantity

### CheckoutCoupon

- id
- checkoutId
- couponId

### CouponResponse

- couponId
- name
- expiredDate
- minOrderAmount
- usableStartAt
- usableEndAt
- isSelected
- disabled

### CheckoutDetailResponse

- checkoutId
- items
- coupons
- remoteArea
- checkoutAmount
- couponDiscount
- shippingFee
- totalAmount

### PaymentResultResponse

- itemCount
- totalQuantity
- totalAmount

# Middlewares

## validateId

### validateCheckoutId

- Number(request.params.checkoutId)로 checkoutId 변환
- checkoutId가 NaN이면 400
- checkoutId가 정수가 아니면 400
- checkoutId가 1보다 작으면 400
- 실패 시 ERROR_RESPONSE.INVALID_CHECKOUT_ID 반환
- 아니면 next()

# Schedulers

## checkout.scheduler

> 결제 전 임시 주문 cleanup 배치를 담당한다.
> Express 기능이 아니라, Express 서버와 같은 Node.js 프로세스에서 실행하는 scheduler 코드다.

### constants

- CHECKOUT_TTL_HOURS = 정책값
- CHECKOUT_CLEANUP_INTERVAL_MS = 정책값

### functions

- startCheckoutCleanupScheduler()
  - 서버 시작 시 1회 호출
  - setInterval 또는 node-cron으로 주기 실행
  - checkoutService.deleteExpiredCheckouts() 호출
  - Express request/response 흐름과 분리
- stopCheckoutCleanupScheduler()
  - 서버 종료 시 interval 정리

## checkout.service

### cleanup functions

- deleteExpiredCheckouts()
  - expiredAt = now - CHECKOUT_TTL_HOURS 계산
  - checkout 단위로 transaction 처리
    - CHECKOUT_DB.created_at이 expiredAt보다 오래된 checkout 조회
    - 삭제 직전 CHECKOUT_DB 존재 여부 재확인
    - CHECKOUT_COUPON_DB 삭제
    - CHECKOUT_ITEM_DB 삭제
    - CHECKOUT_DB 삭제

# Errors

## ERROR_RESPONSE

### checkout

- INVALID_CHECKOUT_ID
- CHECKOUT_NOT_FOUND
- INVALID_QUANTITY
- INVALID_COUPON_CONDITION
- COUPON_NOT_FOUND

### checkout에서 재사용

- INVALID_REQUEST_BODY
- PRODUCT_NOT_FOUND
- CART_ITEM_NOT_FOUND
- OUT_OF_STOCK
