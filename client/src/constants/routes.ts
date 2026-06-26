import { generatePath } from "react-router";

export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

export const ROUTES = {
  CART: "/cart",
  CHECKOUT: "/checkout/:checkoutId",
  ORDER_SUCCESS: "/order-success",
} as const;

// 출처: https://confeti.palms.blog/type-safe-routing
export type Routes = (typeof ROUTES)[keyof typeof ROUTES];
export type PathParams<Path extends string> = Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | PathParams<`/${Rest}`>
  : Path extends `${string}:${infer Param}`
    ? Param
    : never; // 동적 파라미터 이름들을 유니온 타입으로 추출 ex. "userId" | "orderId"

/**
 * 동적 파라미터를 채워 실제 경로 문자열을 만든다.
 * // "/posts/10/comments/5"
 * ex. buildPath("/posts/:postId/comments/:commentId", { postId: 10, commentId: 5 })
 */
export const buildPath = <P extends Routes>(path: P, params: { [K in PathParams<P>]: string | number }): string => {
  // generatePath는 값이 string이어야 하므로 number를 변환한다.
  const convertedParams = Object.entries(params).reduce(
    (acc, [key, value]) => {
      acc[key as PathParams<P>] = String(value);
      return acc;
    },
    {} as { [K in PathParams<P>]: string },
  );

  // react-router v7의 generatePath params 타입은 키를 string 전체로 열어둔(인덱스 시그니처) 넓은 타입이라
  // 정확한 키만 가진 좁은 객체를 거부한다. 타입 검증은 위 시그니처(PathParams)에서 이미 끝났으므로
  // 라이브러리 경계인 이 한 줄에서만 단언으로 통과시킨다.
  return generatePath(path, convertedParams as never);
};
