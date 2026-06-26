import { Preorder } from "./Preorder";
import { PreorderRepositoryInterface } from "./interfaces/PreorderRepositoryInterface";
import * as crypto from "crypto";

interface Cache {
  preorder: Preorder;
  expiresAt: number;
}

export default class InMemoryPreorderRepository implements PreorderRepositoryInterface {
  #Cache: Map<string, Cache>;
  #ttlMs: number;

  constructor(ttlMinutes: number = 30) {
    this.#Cache = new Map();
    this.#ttlMs = ttlMinutes * 60 * 1000; // ms
  }

  save(items: Preorder["items"]): Preorder {
    const preorderId = crypto.randomUUID();
    const now = Date.now();

    const newPreorder: Preorder = {
      preorderId,
      items
    };

    this.#Cache.set(preorderId, {
      preorder: newPreorder,
      expiresAt: now + this.#ttlMs,
    });

    return newPreorder;
  }

  // 찾을 때 캐시 만료 여부 확인
  findById(preorderId: string): Preorder | null {
    const entry = this.#Cache.get(preorderId);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.#Cache.delete(preorderId);
      return null;
    }

    return { ...entry.preorder };
  }
}
