const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Shopping Cart Full Stack API',
    version: '1.0.0',
    description:
      '장바구니, 주문 확인, 쿠폰 테스트용 API 문서입니다. 더미 데이터가 포함되어 있어 바로 호출해볼 수 있습니다.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Products', description: '상품 API' },
    { name: 'Cart', description: '장바구니 API' },
    { name: 'Order Check', description: '주문 확인 API' },
    { name: 'Coupons', description: '쿠폰 API' },
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'number', example: 400 },
          errorCode: { type: 'string', example: 'INVALID' },
          errorMessage: { type: 'string', example: '필드 값이 유효하지 않습니다.' },
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'selectedCouponId' },
                errorCode: { type: 'string', example: 'REQUIRED' },
              },
            },
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: '망고' },
          price: { type: 'number', example: 5000 },
          imgUrl: { type: 'string', example: 'https://example.com/images/mango.png' },
        },
      },
      CartItem: {
        type: 'object',
        properties: {
          product: { $ref: '#/components/schemas/Product' },
          quantity: { type: 'number', example: 2 },
          checkStatus: { type: 'boolean', example: true },
        },
      },
      CartPayInfo: {
        type: 'object',
        properties: {
          orderPrice: { type: 'number', example: 50000 },
          deliveryFee: { type: 'number', example: 3000 },
          totalOrderAmount: { type: 'number', example: 53000 },
        },
      },
      OrderCheckPayInfo: {
        type: 'object',
        properties: {
          orderPrice: { type: 'number', example: 50000 },
          deliveryFee: { type: 'number', example: 0 },
          couponDiscountAmount: { type: 'number', example: 5000 },
          totalOrderAmount: { type: 'number', example: 45000 },
        },
      },
      OrderCheckProduct: {
        allOf: [
          { $ref: '#/components/schemas/Product' },
          {
            type: 'object',
            properties: {
              quantity: { type: 'number', example: 10 },
            },
          },
        ],
      },
      CouponDescription: {
        type: 'object',
        properties: {
          type: { type: 'string', example: 'MIN_ORDER_AMOUNT' },
          content: {
            type: 'object',
            additionalProperties: true,
            example: { minAmount: 50000 },
          },
        },
      },
      Coupon: {
        type: 'object',
        properties: {
          couponId: { type: 'string', example: 'FREESHIPPING' },
          couponTitle: { type: 'string', example: '무료 배송 쿠폰' },
          disabled: { type: 'boolean', example: false },
          description: {
            type: 'array',
            items: { $ref: '#/components/schemas/CouponDescription' },
          },
        },
      },
      ProductCreateRequest: {
        type: 'object',
        required: ['name', 'price', 'imgUrl'],
        properties: {
          name: { type: 'string', example: '사과' },
          price: { type: 'number', example: 9000 },
          imgUrl: { type: 'string', example: 'https://example.com/images/apple.png' },
        },
      },
      AddCartItemRequest: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string', example: '3' },
          quantity: { type: 'number', example: 2 },
        },
      },
      CheckStatusRequest: {
        type: 'object',
        required: ['checkStatus'],
        properties: {
          checkStatus: { type: 'boolean', example: true },
        },
      },
      QuantityRequest: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'number', example: 10 },
        },
      },
      SelectedCouponsRequest: {
        type: 'object',
        required: ['selectedCouponId'],
        properties: {
          selectedCouponId: {
            type: 'array',
            items: { type: 'string' },
            example: ['BOGO', 'FREESHIPPING'],
          },
        },
      },
    },
  },
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: '상품 목록 조회',
        responses: {
          200: {
            description: '상품 목록',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    products: [
                      {
                        id: '1',
                        name: '망고',
                        price: 5000,
                        imgUrl: 'https://example.com/images/mango.png',
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: '상품 등록',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductCreateRequest' },
            },
          },
        },
        responses: {
          201: {
            description: '등록된 상품',
            content: {
              'application/json': {
                example: {
                  status: 201,
                  data: {
                    id: '4',
                    name: '사과',
                    price: 9000,
                    imgUrl: 'https://example.com/images/apple.png',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/products/{productId}': {
      delete: {
        tags: ['Products'],
        summary: '상품 삭제',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '삭제 성공',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: { id: '1' },
                },
              },
            },
          },
        },
      },
    },
    '/cart': {
      post: {
        tags: ['Cart'],
        summary: '장바구니 상품 추가',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AddCartItemRequest' },
            },
          },
        },
        responses: {
          201: {
            description: '추가된 장바구니 상품',
            content: {
              'application/json': {
                example: {
                  status: 201,
                  data: {
                    product: {
                      id: '3',
                      name: '딸기',
                      price: 8000,
                      imgUrl: 'https://example.com/images/strawberry.png',
                    },
                    quantity: 2,
                    checkStatus: true,
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Cart'],
        summary: '장바구니 조회',
        responses: {
          200: {
            description: '장바구니와 결제 정보',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    isAllSelected: false,
                    cartItems: [
                      {
                        product: {
                          id: '1',
                          name: '망고',
                          price: 5000,
                          imgUrl: 'https://example.com/images/mango.png',
                        },
                        quantity: 2,
                        checkStatus: true,
                      },
                    ],
                    payInfo: {
                      orderPrice: 10000,
                      deliveryFee: 3000,
                      totalOrderAmount: 13000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/cart/pay-info': {
      get: {
        tags: ['Cart'],
        summary: '장바구니 결제 정보 조회',
        responses: {
          200: {
            description: '결제 정보',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    orderPrice: 10000,
                    deliveryFee: 3000,
                    totalOrderAmount: 13000,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/carts/select/product/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: '장바구니 상품 선택 상태 변경',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckStatusRequest' },
            },
          },
        },
        responses: {
          200: {
            description: '선택 상태 변경 결과',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    isAllSelected: false,
                    cartItem: {
                      product: {
                        id: '1',
                        name: '망고',
                        price: 5000,
                        imgUrl: 'https://example.com/images/mango.png',
                      },
                      quantity: 2,
                      checkStatus: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/carts/select': {
      patch: {
        tags: ['Cart'],
        summary: '장바구니 전체 선택 상태 변경',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckStatusRequest' },
            },
          },
        },
        responses: {
          200: {
            description: '전체 선택 결과',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    isAllSelected: true,
                    cartItems: [],
                  },
                },
              },
            },
          },
        },
      },
    },
    '/carts/products/{productId}': {
      patch: {
        tags: ['Cart'],
        summary: '장바구니 상품 수량 변경',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QuantityRequest' },
            },
          },
        },
        responses: {
          200: {
            description: '변경된 장바구니 항목',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    product: {
                      id: '1',
                      name: '망고',
                      price: 5000,
                      imgUrl: 'https://example.com/images/mango.png',
                    },
                    quantity: 10,
                    checkStatus: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/cart/product/{productId}': {
      delete: {
        tags: ['Cart'],
        summary: '장바구니 상품 삭제',
        parameters: [
          {
            name: 'productId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '삭제 결과',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: { deletedProductId: '1' },
                },
              },
            },
          },
        },
      },
    },
    '/order-check': {
      post: {
        tags: ['Order Check'],
        summary: '주문 확인 생성',
        description: '현재 선택된 장바구니 상품으로 주문 확인 스냅샷을 생성합니다.',
        responses: {
          201: {
            description: '생성된 주문 확인 상품 목록',
            content: {
              'application/json': {
                example: {
                  status: 201,
                  data: {
                    products: [
                      {
                        id: '1',
                        name: '망고',
                        price: 5000,
                        imgUrl: 'https://example.com/images/mango.png',
                        quantity: 10,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Order Check'],
        summary: '주문 확인 조회',
        responses: {
          200: {
            description: '주문 확인 상품과 결제 정보',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    products: [
                      {
                        id: '1',
                        name: '망고',
                        price: 5000,
                        imgUrl: 'https://example.com/images/mango.png',
                        quantity: 10,
                      },
                    ],
                    payInfo: {
                      orderPrice: 50000,
                      deliveryFee: 0,
                      couponDiscountAmount: 5000,
                      totalOrderAmount: 45000,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/order-check/pay-info': {
      get: {
        tags: ['Order Check'],
        summary: '주문 확인 결제 정보 조회',
        responses: {
          200: {
            description: '결제 정보',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    orderPrice: 50000,
                    deliveryFee: 0,
                    couponDiscountAmount: 5000,
                    totalOrderAmount: 45000,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/order-check/select/remote-areas': {
      patch: {
        tags: ['Order Check'],
        summary: '도서산간 여부 선택',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckStatusRequest' },
            },
          },
        },
        responses: {
          200: {
            description: '설정 결과',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: { checkStatus: true },
                },
              },
            },
          },
        },
      },
    },
    '/order-check/coupons': {
      get: {
        tags: ['Coupons'],
        summary: '쿠폰 목록 조회',
        description:
          '현재 주문 확인 상태 기준으로 사용 가능 쿠폰과 기본 선택 쿠폰 조합을 조회합니다.',
        responses: {
          200: {
            description: '쿠폰 목록',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: {
                    coupons: [
                      {
                        couponId: 'BOGO',
                        couponTitle: '2+1 쿠폰',
                        disabled: false,
                        description: [
                          {
                            type: 'MIN_QUANTITY_PER_PRODUCT',
                            content: { minQuantity: 2 },
                          },
                        ],
                      },
                      {
                        couponId: 'FREESHIPPING',
                        couponTitle: '무료 배송 쿠폰',
                        disabled: false,
                        description: [
                          {
                            type: 'MIN_ORDER_AMOUNT',
                            content: { minAmount: 50000 },
                          },
                        ],
                      },
                    ],
                    selectedCoupons: ['BOGO', 'FREESHIPPING'],
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Coupons'],
        summary: '선택 쿠폰 할인액 계산',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SelectedCouponsRequest' },
            },
          },
        },
        responses: {
          200: {
            description: '할인액 계산 결과',
            content: {
              'application/json': {
                example: {
                  status: 200,
                  data: { discountAmount: 8000 },
                },
              },
            },
          },
          400: {
            description: '잘못된 쿠폰 선택',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      patch: {
        tags: ['Coupons'],
        summary: '선택 쿠폰 적용',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SelectedCouponsRequest' },
            },
          },
        },
        responses: {
          204: {
            description: '적용 완료',
          },
          400: {
            description: '잘못된 쿠폰 선택',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
} as const;

export default openApiSpec;
