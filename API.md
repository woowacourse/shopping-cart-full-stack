## 상품

| 기능 | Method | URL | Request | Response |
|------|------|------|------|------|
| 상품 목록 조회 | GET | /api/products/ | X | <pre>[<br>{<br>&nbsp;&nbsp;"id": 1,<br>&nbsp;&nbsp;"name": "수건",<br>&nbsp;&nbsp;"thumbnail": "/some_image2",<br>&nbsp;&nbsp;"price": 10000<br>},<br>{<br>&nbsp;&nbsp;"id": 2,<br>&nbsp;&nbsp;"name": "양말",<br>&nbsp;&nbsp;"thumbnail": "/some_image",<br>&nbsp;&nbsp;"price": 3000<br>}<br>]</pre> |
| 상품 추가 | POST | /api/products/ | <pre>{<br>&nbsp;&nbsp;"name": "치킨",<br>&nbsp;&nbsp;"thumbnail": "chicken.png",<br>&nbsp;&nbsp;"price": 5000<br>}</pre> | <pre>{<br>&nbsp;&nbsp;"id": 3<br>}</pre> |
| 상품 삭제 | DELETE | /api/products/:id/ | X | X |

## 장바구니

| 기능 | Method | URL | Request | Response |
|------|------|------|------|------|
| 목록 조회 | GET | /api/cart/ | X | <pre>[<br>{<br>&nbsp;&nbsp;"id": 1,<br>&nbsp;&nbsp;"product_id": 1,<br>&nbsp;&nbsp;"quantity": 20<br>},<br>{<br>&nbsp;&nbsp;"id": 2,<br>&nbsp;&nbsp;"product_id": 5,<br>&nbsp;&nbsp;"quantity": 10<br>}<br>]</pre> |
| 특정 상품 수량 변경 | PATCH | /api/cart/items/:id/ | <pre>{<br>&nbsp;&nbsp;"quantity": 15<br>}</pre> | <pre>{<br>&nbsp;&nbsp;"id": 1,<br>&nbsp;&nbsp;"product_id": 1,<br>&nbsp;&nbsp;"quantity": 15<br>}</pre> |
| 특정 상품 삭제 | DELETE | /api/cart/items/:id/ | X | X |