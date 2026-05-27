## 상품 조회

### `GET` `/products` - 상품들의 정보를 모두 가져온다.

<details>
<summary>

</summary>

Success

```js
// Response Status: 200
// 리소스(상품 정보)가 메세지 body에 전달되었기 때문

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

</details>

### `GET` `/products/:id` - 특정 상품의 정보를 가져온다.

<details>
<summary></summary>

path params

```js
id: number;
```

Success

```js
// Response Status: 200
// 리소스(상품 정보)가 메세지 body에 전달되었기 때문

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

400 Error

```js
// Response Status: 400
// 리소스(상품 정보)의 id가 숫자로 변경할 수 없을 때

{
  result: "error",
  message: "해당하는 상품의 id 형식이 유효하지 않습니다.",
};
```

404 Error

```js
// Response Status: 404
// 리소스(상품 정보)의 id가 존재하지 않음

{
  result: "error",
  message: "해당하는 상품이 없습니다.",
};
```

</details>

### `POST` `/products` - 상품 정보를 등록한다.

<details>
<summary></summary>

Success

```js
// Response Status: 201
// 요청이 성공했고 그 결과 새로운 리소스(상품 정보)가 생성되었기 때문

{
  name: "상품이름A",
  img: "/src.com",
  price: 35000,
}
```

400 Error

```js
// request status 400,
// 필수 입력 유효성 검증 실패 시, 필드 에러 메세지를 반환한다.

{
  result: "error",
  message: "요청 값이 올바르지 않습니다.",
  errors: [
    {
      field: "name",
      code: "INVALID_PRODUCT_NAME",
      message: "상품 이름이 유효하지 않습니다."
    },
    {
      field: "price",
      code: "INVALID_PRODUCT_PRICE",
      message: "상품 가격이 유효하지 않습니다."
    },
    {
      field: "imageUrl",
      code: "PRODUCT_IMAGE_URL_INVALID",
      message: "유효한 이미지 URL 형식이 아닙니다."
    }
  ]
}
```

404 Error

```js
// request status 404,
// 리소스(상품 정보)의 id가 없어서 메세지 body에 전달되지 않았기 때문
{
  result: "error",
  message: "해당하는 상품의 id가 없습니다.",
};
```

</details>

### `DELETE` `/products/:id` : 특정 상품을 삭제한다.

<details>
<summary></summary>

Success

```js
// request status 204
// 리소스(상품 정보)의 id가 없어서 메세지 body에 전달되지 않았기 때문

// No Contents
```

해당 상품 id를 찾을 수 없을 때

```js
// request status 204
// 존재하지 않는 id에도 멱등성을 위해 204를 반환한다.

// No Contents
```

</details>

## 장바구니

<details>
<summary>

</summary>
