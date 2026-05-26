# 장바구니 풀스택 미션

## Step 1

### 기능 구현 목록

- 상품 (Products Controller)
  - [ ] 상품 목록을 조회할 수 있다. (GET /products)
    - [ ] PRODUCTS DB가 존재하지 않으면 500 에러
    - [ ] 성공시 200 OK
  - [ ] 상품을 추가할 수 있다. (POST /products/:id)
    - [ ] 성공시 201 Created
  - [ ] 상품을 삭제할 수 있다. (DELETE /products/:id)
    - [ ] 해당 상품이 장바구니에 있으면 함께 제거한다. (삭제될 상품 id에 해당하는 id를 포함하는 객체를 CART db에서 삭제)
    - [ ] 성공시 204 OK
    - [ ] 해당 id가 디비에 존재하지 않는다면 404 에러

- 장바구니 (Cart Controller)
  - [ ] 장바구니에 담긴 상품 목록을 조회할 수 있다. (GET /cart)
    - [ ] 성공시 200 OK
    - [ ] PODUCTS DB가 존재하지 않으면 500 에러
  - [ ] 장바구니에 상품을 추가할 수 있다. (POST /cart/:id)
    - [ ] 성공시 201 Created
  - [ ] 장바구니 상품의 수량을 변경할 수 있다. (PUT /cart/:id)
    - [ ] 성공시 204 OK
    - [ ] 해당 id가 디비에 존재하지 않는다면 404 에러
  - [ ] 장바구니에 담긴 상품을 제거할 수 있다. (DELETE /cart/:id)
    - [ ] 성공시 204 OK
    - [ ] 해당 id가 디비에 존재하지 않는다면 404 에러

- [ ] 프론트엔드와의 연동을 위한 CORS 설정

### 검증

- [ ] 필수 필드 누락 시 에러를 응답한다 (400 Bad Request)
- [ ] 존재하지 않는 상품/장바구니 아이템 요청 시 에러를 응답한다 (404 Not Found)
- [ ] quantity는 1 이상 99 이하의 정수여야 한다 (400 Bad Request)
- [ ] price는 0보다 큰 숫자여야 한다 (400 Bad Request)
- [ ] 상품명은 최대 100자이다 (400 Bad Request)
