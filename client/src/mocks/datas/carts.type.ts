import type { ServerCartResponse } from "@/apis/carts/dto";

export type ServerCartProduct = ServerCartResponse["data"]["products"][number];

export type ServerCart = ServerCartResponse["data"];
