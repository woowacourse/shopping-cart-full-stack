## 상품 조회

GET /products : 상품들의 정보를 모두 가져온다.

```js
// response status 200, 리소스(상품 정보)가 메세지 body에 전달되었기 때문
{
  result: "success",
  data: {
    products: [
      {
        id: 1,
        name: "상품이름A",
        img: "/src.com",
        price: 35000,
      },
      {
        id: 2,
        name: "상품이름B",
        img: "/src.com",
        price: 25000,
      },
    ],
  },
}
```

GET /products/:productId : 특정 상품의 정보를 가져온다.

```js
//path params
productId: string;
```

Success

```js
// response status 200, 리소스(상품 정보)가 메세지 body에 전달되었기 때문
{
  result: "success",
  data: {
    id: 1,
    name: "상품이름A",
    img: "/src.com",
    price: 35000,
  },
};
```

해당하는 상품이 없음 (PathParams 잘못됨)

```js
// response status 404 Not Found
{
  result: "error",
  message:"해당하는 상품이 없습니다.",
};
```

POST /products : 상품 정보를 등록한다.

```js
// request status 201, body params, 요청이 성공했고 그 결과 새로운 타입이 생성되었기 때문
{
  name: "상품이름A",
  img: "/src.com",
  price: 35000,
}
```

Error

```js
// request status 400, 필수 입력 필드 누락 시 에러 메세지를 반환한다.
{
  result: "error",
  message: "필수 입력 필드가 누락 되었습니다.",
};
```

DELETE /products/{productId} : 특정 상품을 삭제한다.

```js
// request
{
}
```

```js
// response
{
}
```
