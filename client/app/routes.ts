import {
  type RouteConfig,
  route,
  prefix,
  index,
} from "@react-router/dev/routes";

export default [
  ...prefix("cart/", [
    index("./pages/shopping-cart/ShoppingCartPage.tsx"),
    route("check/:id/", "./pages/shopping-cart/OrderCheckPage.tsx"),
    route("check/purchase/", "./pages/purchase-check/PurchaseCheckPage.tsx"),
  ]),
] satisfies RouteConfig;
