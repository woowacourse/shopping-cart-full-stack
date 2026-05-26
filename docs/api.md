# 설계 API 명세와 설계 결정 이유
- (endpoint, request body, response body, http status code)

### HTTP 상태 코드

상태 코드 / 사용 기준 

200: 조회/수정 성공 (응답 body 있음) 

201: 생성 성공 (응답 body 있음) 

204: 삭제 성공 (응답 body 없음) 

400: 클라이언트 요청 오류 (유효성 검증 실패, 필수 필드 누락) 

404: 존재하지 않는 리소스 요청 

500: 서버 내부 오류 

## products
- GET
  - endpoint : GET /products
  - request body : X
  - response body : 예시
        ```json
        [
        {
            "productId": 1,
            "name": "신발A",
            "price": 35000,
            "thumbnailUrl": "https://example.com/image.png",
            "quantity": 1,
            "totalQuantity": 10
        }
        ]
        ```
  - http status code : 200
  - 설계 결정 이유 : 클라이언트가 GET을 통해 상품 데이터를 요청하고, 성공적으로 배열 값을 가져왔기 때문에, 200이 적합하다.
- POST
  - endpoint : POST /products
  - request body : 예시
    ```json
        {
            "name": "신발B",
            "price": 35000,
            "thumbnailUrl": "https://example.com/image.png",
            "totalQuantity": 10
        }
    ```
  - response body : 예시
    ```json
        {
            "productId": 2,
            "name": "신발B",
            "price": 35000,
            "thumbnailUrl": "https://example.com/image.png",
            "totalQuantity": 10
        }
    ```
  - http status code : 201
  - 설계 결정 이유 : 새로운 상품을 성공적으로 등록하고 생성된 id를 받아 응답받으므로 201 created 응답이 적합하다.
- DELETE
  - endpoint : DELETE /products/:productId
  - request body : X
  - response body : X
  - http status code : 204
  - 설계 결정 이유 : 엔드포인트 요청은 성공하고, 데이터를 서버에서 삭제한 뒤 204 No Content 응답을 받는 것이 DELETE에 적합하다.

## carts
- GET
  - endpoint : GET /carts
  - request body : X
  - response body : 예시
    ```json
    [   
        {
            "cartItemId" : 1,
            "quantity": 1, 
            "product": {
              "productId": 2,
              "name": "신발B",
              "price": 35000,
              "thumbnailUrl": "https://example.com/image.png",
            },
        }
    ]
    ```
  - http status code : 200
  - 설계 결정 이유 : product의 quantity는 총 재고의 개념이고, carts의 quantity는 상품의 총 재고(서버)를 알 필요는 없이 클라이언트가 몇 개를 구매할 것인지 표현하는 데이터로 헷갈리지 않게 따로 명시
  - productId를 사용하지 않고, cartItemId를 사용하는 이유: 같은 상품일지라도 추후 옵션 기능이 추가되었을 때 구분하기 위함 / 쿠폰 적용(확장 가능성 고려)
- POST
 - endpoint: POST /carts
 - request body : 예시 
    ```json
    {
        "productId": 1,
        "quantity": 1,
    }
    ```
- response body : 에시 
    ```json
    {
    "cartItemId": 1,
    "quantity": 1,
    "product": {
        "productId": 1,
        "name": "신발A",
        "price": 35000,
        "thumbnailUrl": "https://example.com/image.png"
    },
    }
    ```
  - http status code : 201
  - 설계 결정 이유 : 추후 사용자가 장바구니에 담기를 눌렀을 때, 해당 상품의 Id와 담은 수량을 POST를 통해 장바구니에 보내줘야 함. 보내주면, cartItemId가 생성되고 사용자가 구매하기로 처음 결정한 해당 item의 수량, 상품정보를 응답한다.
- PATCH 
    - endpoint : PATCH /carts/:cartItemId
    - request body: 예시 
        ```json
        {
        "quantity": 3
        }
        ```
    - response body: 예시 
        ```json
        {
        "cartItemId": 1,
        "quantity": 3,
        "product": {
            "productId": 1,
            "name": "신발A",
            "price": 35000,
            "thumbnailUrl": "https://example.com/image.png"
        },
        }
        ```
    - http status code : 200
    - 설계 결정 이유 : quantity만 부분 수정하므로 PUT대신 PATCH를 사용한다. 수정된 body를 다시 response 받아서 화면에 표시해야 하기 때문에, 200을 사용한다.
- DELETE
    - endpoint : DELETE /carts/:cartItemId
    - requests body: X
    - response body: X 204 No Content
    - 설계 결정 이유: 삭제 성공 후 반환할 데이터가 없으므로 204 No Content를 사용한다.

## 에러 핸들링
- 검증 조건
  - 필수 필드 누락 시 에러를 응답한다
  - 존재하지 않는 상품/장바구니 아이템 요청 시 에러를 응답한다
  - quantity는 1 이상 99 이하의 정수여야 한다
  - price는 0보다 큰 숫자여야 한다
  - 상품명은 최대 100자이다

- 400
  - 적용 엔드포인트: POST /products, POST /carts, PATCH /carts/:cartItemId
  - 검증 조건: 
     1. 필수 필드 누락: /products의 productId, name, price, thumbnailUrl, totalQuantity 데이터 누락
     2. 필수 필드 누락: /carts의 productId, quantity 데이터 누락
     3. 필수 필드 누락: /carts의 quantity 데이터 누락
     4. quantity는 1이상 99이하의 정수여야 한다: 전부
     5. price는 0보다 큰 숫자여야 한다: POST
     6. 상품명은 최대 100자이다: POST
  - response body: { message: "`${field}가 잘못되었습니다!`" }
  - 설계 결정 이유: 클라이언트가 서버로 보내는 요청이 잘못되거나, 문법이 어긋나는 경우에 발생하는 것이 400 에러이다.

- 404
  - 적용 엔드포인트: DELETE /products/:productId, DELETE /carts/:cartItemId, PATCH /carts/:cartItemId
  - 검증 조건: 
       1. 존재하지 않는 장바구니 아이템 수량 변경 요청 시: cartItemId가 존재하지 않을 경우
       2. DELETE 시 productId, cartItemId가 서버에 존재하지 않을 때
  - response body: { message: "해당 Item이 존재하지 않습니다!" }
  - 설계 결정 이유: 서버가 요청한 URL에 대해 해당하는 리소스를 찾지 못했을 때 404 에러를 사용하므로, 데이터를 제거하거나 수량을 업데이트할 Id가 없는 경우, 404 에러를 반환한다.

- 500
  - 적용 엔드포인트: 전체
  - 검증 조건: 에상치 못한 네트워크 에러가 발생했을 경우
  - response body: { message: "서버에서 예상치 못한 에러가 발생했습니다!" }
  - 설계 결정 이유: 예상치 못한 네트워크 에러에 대한 express 예외처리
